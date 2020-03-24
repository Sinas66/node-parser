const app = require("express")();
const { promises } = require("fs");
const path = require("path");

const parseCountries = require("./countries");
const TelegramBot = require("node-telegram-bot-api");

const token = "1080831767:AAFVCUNOYNRIJxyxSv95K464HmeZWISDDwo";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async msg => {
  const chatId = msg.chat.id;
  const data = await parseCountries();
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, JSON.stringify(data));
  const filePath = path.resolve(__dirname, "./example.png");

  const screenshot = await promises.readFile(filePath);
  bot.sendPhoto(chatId, screenshot);
  bot.sendMessage(
    chatId,
    `Hello, here is your message- ${msg.from.first_name}`
  );
});

app.use("/", async (req, res) => {
  const data = await parseCountries();
  console.log("data", data);
  res.json(data);
});

app.listen(5055, () => {
  console.log("App listening on port 5055!");
});
