const fs = require("fs");
let count = 0;
const start = Date.now();

const generate = async () => {
  fs.stat("./string.txt", (err, stat) => {
    if (err) generate();
    const size = stat.size / 1000000;
    if (size < 512) {
      console.log("stat", size);
      fs.appendFile("./string.txt", "12345 ", err => console.log);
      count++;
      generate();
      return;
    }
    const end = Date.now();

    const time = new Date(end - start);
    console.log(`Total time is: ${time / 1000}s`);
    console.log("count", count);
  });
};

generate();
