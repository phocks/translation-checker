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
    let englishText;
    let nodeName;

    if (!element) return;

    if (element.text) {
      englishText = element.text.en;
      nodeName = "text";
    } else if (element.narrative) {
      englishText = element.narrative.en;
      nodeName = "narrative";
    } else if (element.description) {
      englishText = element.description.en;
      nodeName = "description";
    } else if (element.title) {
      englishText = element.title.en;
      nodeName = "title";
    } else if (element.viz_headline) {
      englishText = element.viz_headline.en;
      nodeName = "viz_headline";
    } else if (element.headline) {
      englishText = element.headline.en;
      nodeName = "headline";
    } else if (element.viz_pre_text) {
      englishText = element.viz_pre_text.en;
      nodeName = "viz_pre_text";
    } else if (element.card_post_text) {
      englishText = element.card_post_text.en;
      nodeName = "card_post_text";
    } else if (element.label) {
      englishText = element.label.en;
      nodeName = "label";
    } else return;

    const foundChoice = reference.find(el => {
      let firstCompare = el.en.toLowerCase();
      let secondCompare = englishText.toString().toLowerCase();

      // Remove markup formatting
      firstCompare = firstCompare.replace(/\[/gi, "");
      firstCompare = firstCompare.replace(/\]\(title\)/gi, "");
      firstCompare = firstCompare.replace(/\]\(bold\)/gi, "");
      firstCompare = firstCompare.replace(/\]\]\%/gi, "");
      firstCompare = firstCompare.replace(/\[\[/gi, "");
      firstCompare = firstCompare.replace(/\%\{headlineCalc\}/gi, "x");

      secondCompare = secondCompare.replace(/\[/gi, "");
      secondCompare = secondCompare.replace(/\]\(title\)/gi, "");
      secondCompare = secondCompare.replace(/\]\(bold\)/gi, "");
      secondCompare = secondCompare.replace(/\%\{headlineCalc\}/gi, "x");
      secondCompare = secondCompare.replace(/\]\]\%/gi, "");
      secondCompare = secondCompare.replace(/\[\[/gi, "");

      return firstCompare === secondCompare;
    });

    const otherLang = this.node[nodeName][OTHER_LANGUAGE];

    if (foundChoice) {
      if (!otherLang) {
        logFilename = true;
        foundChoice[OTHER_LANGUAGE] = foundChoice[OTHER_LANGUAGE].replace(
          "[[X]]%",
          "[%{headlineCalc}](title)"
        );
        foundChoice[OTHER_LANGUAGE] = foundChoice[OTHER_LANGUAGE].replace(
          "[[x]]%",
          "[%{headlineCalc}](title)"
        );
        this.node[nodeName][OTHER_LANGUAGE] = foundChoice[OTHER_LANGUAGE];
        console.log(foundChoice);
      }
    }
  });

  if (logFilename) console.log("^^^^from " + file);
  logFilename = false;

  fs.writeFileSync("./out/" + file, YAML.stringify(parsedYaml));
}
