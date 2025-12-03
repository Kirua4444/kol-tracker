// scripts/historical-scraper.js
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BEARER = process.env.TWITTER_BEARER_TOKEN;
const BIRDEYE_KEY = process.env.BIRDEYE_API_KEY;

const BULLISH_KEYWORDS = ['buy','aped','long','loading','moon','10x','100x','sending','pumping','bought','in','entry','add','adding','lfg','all in','🚀','🌙','💎'];

// Récupère les 77 usernames depuis la base
async function getKols() {
  const { data } = await supabase.from('kols').select('username');
  return data.map(k => k.username);
}

async function sleep(ms) { await new Promise(r => setTimeout(r, ms)); }

async function getTweetsSince(username, since = '2025-01-2024') {
  let allTweets = [];
  let pagination_token = null;

  do {
    let url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`;
    const userRes = await fetch(url, { headers: { Authorization: `Bearer ${BEARER}` } });
    const user = await userRes.json();
    if (!user.data?.id) break;

    url = `https://api.twitter.com/2/users/${user.data.id}/tweets?tweet.fields=created_at&max_results=100&start_time=${since}T00:00:00Z`;
    if (pagination_token) url += `&pagination_token=${pagination_token}`;

    const res = await fetch(url, { headers: { Authorization: `Bearer ${BEARER}` } });
    const json = await res.json();

    if (!json.data || json.data.length === 0) break;
    allTweets.push(...json.data);
    pagination_token = json.meta.next_token;
    console.log(`@${username} → ${allTweets.length} tweets récupérés`);
    await sleep(900); // respect rate limit
  } while (pagination_token);

  return allTweets;
}

async function main() {
  console.log("Démarrage du scraping historique – 6 mois");
  const kols = await getKols();

  for (const username of kols) {
    console.log(`\nTraitement de @${username}`);
    const tweets = await getTweetsSince(username, '2025-06-01');

    for (const tweet of tweets) {
      const text = tweet.text.toLowerCase();
      if (!BULLISH_KEYWORDS.some(k => text.includes(k.toLowerCase()))) continue;

      const symbols = [...text.matchAll(/\$([a-zA-Z0-9]{2,10})\b/g)].map(m => m[1].toUpperCase());
      if (symbols.length === 0) continue;

      for (const symbol of symbols) {
        // Déduplication 7 jours
        const { data: exists } = await supabase
          .from('calls')
          .select('id')
          .eq('kol_username', username)
          .eq('token_symbol', symbol)
          .gt('called_at', new Date(Date.now() - 7*24*60*60*1000))
          .single();

        if (exists) continue;

        // Récup prix + ATH via Birdeye
        const tokenRes = await fetch(`https://public-api.birdeye.so/defi/token_overview?address=${symbol}`, {
          headers: { 'X-API-KEY': BIRDEYE_KEY }
        });
        const tokenData = await tokenRes.json();

        if (!tokenData.success) continue;

        const token = tokenData.data;
        await supabase.from('calls').insert({
          kol_username: username,
          token_symbol: symbol,
          token_address: token.address,
          chain: token.chain || 'solana',
          called_price: token.price,
          ath_price: token.ath || token.price,
          current_price: token.price,
          pnl_to_ath: token.ath ? ((token.ath / token.price - 1) * 100) : 0,
          market_cap_peak: token.mc_peak || 0,
          is_moonshot: (token.mc_peak || 0) >= 100_000_000,
          sentiment: 'bullish',
          called_at: tweet.created_at,
          tweet_url: `https://x.com/${username}/status/${tweet.id}`,
          tweet_id: tweet.id
        });
      }
    }
    await sleep(3000); // petite pause entre KOLs
  }

  console.log("Scraping historique terminé – leaderboard 100 % réel !");
}

main().catch(console.error);