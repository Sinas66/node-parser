const app = require("express")();
const fs = require("fs");
const path = require("path");

const parseCountries = require("./countries");
const Telegraf = require("telegraf");

const token = "1080831767:AAFVCUNOYNRIJxyxSv95K464HmeZWISDDwo";
const bot = new Telegraf(token);

// bot.on("message", async msg => {
//   const chatId = msg.chat.id;
//   // const data = await parseCountries();
//   // send a message to the chat acknowledging receipt of their message
//   // bot.sendMessage(chatId, JSON.stringify(data));
//   const filePath = path.resolve(__dirname, "./example.png");

//   const screenshot = await promises.readFile(filePath);
//   bot.sendMessage(chatId, `Hello, ${msg.from.first_name}`);
//   bot.sendPhoto(chatId, screenshot);
// });

bot.hears(["Привет", "привет"], async ctx => {
  ctx.reply(
    JSON.stringify(ctx.chat)
      .replace(/,/g, "\n")
      .replace(/{|}/g, "")
  );
  ctx.reply(`Привет, ${ctx.chat.first_name}`);

  const filePath = path.resolve(__dirname, "./example.png");

  ctx.replyWithMediaGroup([
    {
      media: {
        source: fs.createReadStream("./big-image.jpg")
      },
      caption: "1",
      type: "photo"
    },
    {
      media: {
        url:
          "https://babeltechreviews.com/wp-content/uploads/2018/07/rendition1.img_.jpg"
      },
      caption: "1",
      type: "photo"
    },
    {
      media: {
        source: filePath
      },
      caption: "1",
      type: "photo"
    },
    {
      media: {
        source: "./IMG-20120714-009211.jpg"
      },
      caption: "1",
      type: "photo"
    }
  ]);

  ctx.replyWithPhoto({
    source: fs.createReadStream(filePath)
  });

  // try {
  //   const filePath = path.resolve(__dirname, "./example.png");
  //   const screenshot = await promises.readFile(filePath);
  //   ctx.replyWithPhoto(screenshot);
  // } catch (e) {
  //   ctx.reply("error: " + JSON.stringify(e));
  // }
});

bot.launch();

app.use("/", async (req, res) => {
  const data = await parseCountries();
  console.log("data", data);
  res.json(data);
});

app.listen(5055, () => {
  console.log("App listening on port 5055!");
});
