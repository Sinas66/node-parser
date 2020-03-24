const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const parse = async ({
  xPath,
  url,
  headless = true,
  schema,
  selector,
  scenario,
  fileName,
  axiosOptions = {},
  format
}) => {
  // if (!format) {
  //   throw new Error(`format is required`);
  // }

  if (format && typeof format !== "function") {
    throw new Error(`format is not a function`);
  }

  if (!url) {
    throw new Error(`url is required`);
  }
  if (typeof url !== "string") {
    throw new Error(`url must be a string`);
  }

  if (!xPath) {
    throw new Error(`xPath is required`);
  }
  if (typeof xPath !== "string") {
    throw new Error(`xPath must be a string`);
  }

  if (scenario && typeof scenario !== "function") {
    throw new Error(`scenario must be a function`);
  }

  console.log("selector", selector);

  async function asyncForEach(array, callback) {
    for (let index = 0, length = array.length; index < length; index++) {
      await callback(array[index], index, array);
    }
  }

  const puppeteerOptions = { width: 1900, height: 1000 };

  const browser = await puppeteer.launch({
    headless: headless,
    args: [
      `--window-size=${puppeteerOptions.width},${puppeteerOptions.height}`,
      "--no-sandbox"
    ] // new option
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: puppeteerOptions.width,
    height: puppeteerOptions.height
  });

  await page.goto(url);

  // await page.screenshot({ path: "example.png" });
  await page.waitForXPath(xPath);

  const elHandle = await page.$x(xPath);

  let parsedContent = await page.evaluate(
    (el, sel) =>
      sel
        ? Array.from(el.querySelectorAll(sel)).map(el => el.htmlFor)
        : el.textContent,
    elHandle[0],
    selector
  );

  const formatedContent = format ? format(parsedContent) : parsedContent;

  const uniqueContent = new Array(...new Set(formatedContent)).map(el =>
    schema(el)
  );

  //   console.log("uniqueData", uniqueContent);
  console.log("uniqueData", uniqueContent.length);
  const someData = [];

  let scenarioResult;
  if (scenario) {
    scenarioResult = await scenario(page, browser);
  }

  if (fileName) {
    const filePath = path.resolve(__dirname, "parsed", fileName + ".json");

    fs.writeFile(
      filePath,
      JSON.stringify(scenarioResult || uniqueContent),
      err => {
        if (err) throw err;
        console.log(`The file has been saved! Filename: ${fileName}`);
      }
    );
  }

  if (Object.keys(axiosOptions).length > 0) {
    const { schema, ...restOptions } = axiosOptions;

    const errors = [];
    const saved = [];
    const sendData = async () => {
      return await asyncForEach(uniqueContent, async el => {
        // console.log("el", el);
        if (!el) return;
        const jsonData = schema(el);

        return await axios({ ...restOptions, data: jsonData })
          .then(() => saved.push(el))
          .catch(err => errors.push(err.response.data.message));
      });
    };

    sendData().then(() => {
      console.log("saved", saved);
      console.log("errors", errors);
    });
  }

  await browser.close();

  console.log("uniqueContent", uniqueContent);

  return scenarioResult || uniqueContent;
};

module.exports = parse;
