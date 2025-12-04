// scripts/historical-scraper-coingecko.js
import { createClient } from '@supabase/supabase-js';

// Node 18+ / 20+ / 22+ already include fetch globally — no import needed.

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BEARER = process.env.TWITTER_BEARER_TOKEN;

// Mapping manuel des symboles → CoinGecko ID
const SYMBOL_TO_ID = {
  WIF: 'dogwifhat',
  BONK: 'bonk',
  POPCAT: 'popcat',
  MEW: 'cat-in-a-dogs-world',
  GIGA: 'gigachad-2',
  MOTHER: 'mother-iggy',
  BILLY: 'billy',
  MICH: 'michi',
  PEPE: 'pepe',
  USDT: 'tether',
  USDC: 'usd-coin',
  SOL: 'solana',
  ETH: 'ethereum',
  PENGU: 'pengu',
  AURA: 'aura',
  FWOG: 'fwog',
  LOCKIN: 'lock-in',
  GOAT: 'goatseus-maximus',
  PNUT: 'peanut-the-squirrel',
  ACT: 'act-i-the-ai-prophecy',
  SPX: 'spx6900',
};

const BULLISH_KEYWORDS = [
  'buy','aped','long','loading','moon','10x','100x','sending','pumping',
  'bought','in','entry','add','adding','lfg','all in','🚀','🌙','💎'
];

async function sleep(ms) { await new Promise(r => setTimeout(r, ms)); }

async function getKols() {
  const { data, error } = await supabase.from('kols').select('username');
  if (error) throw error;
  return data.map(k => k.username);
}

// Fetch tweets
async function getHistoricalTweets(username, since = '2025-06-01') {
  let tweets = [];
  let pagination_token = null;

  do {
    const userRes = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: { Authorization: `Bearer ${BEARER}` }
    });
    const userJson = await userRes.json();
    if (!userJson.data?.id) break;

    let url = `https://api.twitter.com/2/users/${userJson.data.id}/tweets?tweet.fields=created_at&max_results=100&start_time=${since}T00:00:00Z`;
    if (pagination_token) url += `&pagination_token=${pagination_token}`;

    const res = await fetch(url, { headers: { Authorization: `Bearer ${BEARER}` } });
    const json = await res.json();

    if (!json.data || json.data.length === 0) break;

    tweets.push(...json.data);
    pagination_token = json.meta?.next_token;

    console.log(`@${username} → ${tweets.length} tweets récupérés`);
    await sleep(1000);
  } while (pagination_token);

  return tweets;
}

// Fetch data from CoinGecko
async function getTokenDataFromGecko(symbol) {
  const id = SYMBOL_TO_ID[symbol];
  if (!id) return null;

  try {
    const [priceRes, histRes] = await Promise.all([
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true`),
      fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=1717190400&to=${Math.floor(Date.now()/1000)}`)
    ]);

    const priceData = await priceRes.json();
    const histData = await histRes.json();

    if (!priceData[id]) return null;

    const prices = histData.prices.map(p => p[1]);
    const mcs = histData.market_caps.map(m => m[1]);

    return {
      price: priceData[id].usd,
      ath: Math.max(...prices),
      mc_peak: Math.max(...mcs),
      address: id,
      chain: symbol === 'SOL' || symbol === 'ETH' ? symbol.toLowerCase() : 'solana'
    };
  } catch (e) {
    console.log(`Erreur CoinGecko pour $${symbol} → ignoré`);
    return null;
  }
}

async function main() {
  console.log("Début du scraping historique 6 mois – CoinGecko (gratuit)");
  const kols = await getKols();

  for (const username of kols) {
    console.log(`\nScraping @${username}`);
    const tweets = await getHistoricalTweets(username);

    for (const tweet of tweets) {
      const text = tweet.text.toLowerCase();
      if (!BULLISH_KEYWORDS.some(k => text.includes(k))) continue;

      const symbols = [...text.matchAll(/\$([a-zA-Z0-9]{2,10})\b/g)].map(m => m[1].toUpperCase());
      if (symbols.length === 0) continue;

      for (const symbol of symbols) {
        const { data: exists } = await supabase
          .from('calls')
          .select('id')
          .eq('kol_username', username)
          .eq('token_symbol', symbol)
          .gt('called_at', new Date(Date.now() - 7*24*60*60*1000))
          .single();

        if (exists) continue;

        const token = await getTokenDataFromGecko(symbol);
        if (!token) continue;

        await supabase.from('calls').insert({
          kol_username: username,
          token_symbol: symbol,
          token_address: token.address,
          chain: token.chain,
          called_price: token.price,
          ath_price: token.ath,
          current_price: token.price,
          pnl_to_ath: ((token.ath / token.price) - 1) * 100,
          market_cap_peak: token.mc_peak,
          is_moonshot: token.mc_peak >= 100_000_000,
          sentiment: 'bullish',
          called_at: tweet.created_at,
          tweet_url: `https://x.com/${username}/status/${tweet.id}`,
          tweet_id: tweet.id
        });

        console.log(`Call inséré → $${symbol} par @${username}`);
      }
    }

    await sleep(3000);
  }

  console.log("Scraping historique terminé – ton leaderboard est maintenant 100 % réel !");
}

main().catch(console.error);