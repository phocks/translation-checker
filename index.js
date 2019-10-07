const fs = require("fs");
const chalk = require("chalk");

const files = fs.readdirSync("./files");

for (let file of files) {
  const filename = file;

  const text = fs.readFileSync("./files/" + filename, "utf8");

  const firstLanguage = /en: /g;
  const secondLanguage = /ar: /g;
  // Account for space then linebreak
  const secondLanguagExtra = /ar: \n/g;

  const firstCount = (text.match(firstLanguage) || []).length;
  let secondCount = (text.match(secondLanguage) || []).length;
  const secondExtraCount = (text.match(secondLanguagExtra) || []).length;

  secondCount -= secondExtraCount;

  if (firstCount === secondCount) {
    console.log(
      "Test PASSED for " +
        filename +
        " " +
        secondCount +
        " of " +
        firstCount +
        " missing 0"
    );
  } else {
    console.log(
      chalk.red(
        "Test FAILED for " +
          filename +
          " " +
          secondCount +
          " of " +
          firstCount +
          " missing: " +
          (firstCount - secondCount)
      )
    );
  }
}
