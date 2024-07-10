import { Telegraf } from "telegraf";
import { createClient } from "redis";
import { REDIS_URL, REDIS_PASSWORD, TELEGRAM_BOT_TOKEN } from "./config.js";

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const client = createClient({
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_URL,
    port: 17376,
  },
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

async function connectRedis() {
  try {
    await client.connect();
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}

connectRedis();

bot.start((ctx) => {
  ctx.reply("Send me a Reels link to upload to Instagram!");
});

bot.on('text', (ctx) => {
    const messageText = ctx.message.text.trim();
    const parts = messageText.split('\n\n'); // Split by double newline to separate link and caption

    let link = parts[0].trim();
    let caption = parts[1]?.trim() || ''; // Optional caption, default to empty string if not provided

    client.lPush('reels_queue', JSON.stringify({ link, caption }));
    ctx.reply('Reels link and caption (if any) added to the queue!');
    console.log(`Reels link and caption added to the queue! Reel is ${link} and caption is ${caption}`);

});



  
//   bot.on('text', async (ctx) => {
//     const text = ctx.message.text;
//     const extractedData = extractReelLinkAndCaption(text);
  
//     if (extractedData && extractedData.reelLink) {
//       const { reelLink, caption } = extractedData;
//       const data = { reelLink, caption };
  
//       try {
//         await client.lPush('reels_queue', JSON.stringify(data));
//         ctx.reply('Reels link added to the queue!');
//         console.log("Reel is added to the redis queue!", data);
//       } catch (error) {
//         console.error('Error adding link to queue:', error);
//         ctx.reply('Failed to add the link to the queue. Please try again.');
//       }
//     } else {
//       ctx.reply('Please send a valid Instagram reel link with optional caption.');
//     }
//   });
  
bot.launch();
console.log("Telegram bot is running...");
