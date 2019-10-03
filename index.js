const fs = require("fs");

const files = fs.readdirSync("./files");

for (let file of files) {
  const filename = file;

  const text = fs.readFileSync("./files/" + filename, "utf8");

  const firstLanguage = /en: /g;
  const secondLanguage = /zh: /g;

  const firstCount = (text.match(firstLanguage) || []).length;
  const secondCount = (text.match(secondLanguage) || []).length;

  if (firstCount === secondCount) {
    console.log("Test passed: " + filename);
  } else {
    console.log("Test failed: " + filename);
  }
}
