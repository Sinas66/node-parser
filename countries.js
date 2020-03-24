const parse = require("./parse");

const options = {
  // headless: false,
  url: "https://rozetka.com.ua/men_shoes/c721654/",
  xPath: `//*[@id="sort_strana-proizvoditelj-tovara-90098"]`,
  selector: "#sort_strana-proizvoditelj-tovara-90098",
  waitXPath: `//*[@id="filter_parameters_form"]`,
  schema: el => ({ label: el }),
  fileName: "countries",
  format: data => {
    return data
      .split(")")
      .map(el => {
        const index = el.indexOf("(");
        const str = el
          .slice(0, index)
          .trim()
          .split("/")
          .map(el => el.trim());

        return str;
      })
      .flat();
  }
  // axiosOptions: {
  //   method: "post",
  //   url: "http://localhost:5051/api/v1/countries",
  // }
};

// parse(options);

const parseCountries = async () => parse(options);

module.exports = parseCountries;
