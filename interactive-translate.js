const fs = require("fs");
const YAML = require("yaml");
traverse = require("traverse");

const files = fs.readdirSync("./files");
const reference = require("./reference.json");

const OTHER_LANGUAGE = "vi";

for (let file of files) {
  const filename = file;

  const text = fs.readFileSync("./files/" + filename, "utf8");

  const parsedYaml = YAML.parse(text);

  let logFilename = false;

  traverse(parsedYaml).forEach(function(element) {
    if (element && element.text) {
      // console.log(element);
      // this.node.text.vi = "TEST"
      // console.log(this.node);
      const englishText = element.text.en;
      const foundChoice = reference.find(el => {
        // el.en.toLowerCase() === englishText.toLowerCase()
        const firstCompare = el.en.toLowerCase().replace(/[^a-z0-9\ ]/gi, "");
        const secondCompare = englishText
          .toLowerCase()
          .replace(/[^a-z0-9\ ]/gi, "");

        return firstCompare === secondCompare;
      });

      // console.log(element.text[OTHER_LANGUAGE])

      const otherLang = this.node.text[OTHER_LANGUAGE];

      if (foundChoice) {
        if (!otherLang) {
          this.node.text[OTHER_LANGUAGE] = foundChoice[OTHER_LANGUAGE];
          logFilename = true;
          console.log(foundChoice);
        }

        // if (typeof element.text[OTHER_LANGUAGE] !== "undefined") {
        //   console.log(element.text[OTHER_LANGUAGE]);
        // }
      }

      // console.log(element.text)
    }
  });

  if (logFilename) console.log("^^^^from " + file);
  logFilename = false;

  // console.log(YAML.stringify(parsedYaml));

  fs.writeFileSync("./out/" + file, YAML.stringify(parsedYaml));

  // const choices = parsedYaml.choice_groups[0].choices;

  // for (let choice of choices) {
  //   const englishText = choice.text.en;

  //   const foundChoice = reference.find(el => el.en === englishText);

  //   if (foundChoice) {
  //     choice.text[OTHER_LANGUAGE] = foundChoice[OTHER_LANGUAGE];
  //   }
  // }

  // console.log(YAML.stringify(choices));
}
