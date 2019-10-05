const fs = require("fs");
const YAML = require("yaml");
const jsyaml = require("js-yaml");
const traverse = require("traverse");
const chalk = require("chalk");
const highlight = require("cli-highlight").highlight;
const prettyjson = require("prettyjson");

const files = fs.readdirSync("./files");
const reference = require("./reference.json");

const OTHER_LANGUAGE = "vi";

for (let file of files) {
  const filename = file;

  const text = fs.readFileSync("./files/" + filename, "utf8");

  const parsedYaml = YAML.parse(text);

  let logFilename = false;

  traverse(parsedYaml).forEach(function(element) {
    let englishText = [];
    // let nodeName;

    if (!element) return;

    if (
      !element.text &&
      !element.narrative &&
      !element.description &&
      !element.title &&
      !element.viz_headline &&
      !element.viz_pre_text &&
      !element.headline &&
      !element.card_post_text &&
      !element.label
    )
      return;

    if (element.text) {
      englishText.push({ text: element.text.en, nodeName: "text" });
    }
    if (element.narrative) {
      englishText.push({ text: element.narrative.en, nodeName: "narrative" });
    }

    if (element.description) {
      englishText.push({
        text: element.description.en,
        nodeName: "description"
      });
    }

    if (element.title) {
      englishText.push({ text: element.title.en, nodeName: "title" });
    }

    if (element.viz_headline) {
      englishText.push({
        text: element.viz_headline.en,
        nodeName: "viz_headline"
      });
    }

    if (element.headline) {
      englishText.push({ text: element.headline.en, nodeName: "headline" });
    }

    if (element.viz_pre_text) {
      englishText.push({
        text: element.viz_pre_text.en,
        nodeName: "viz_pre_text"
      });
    }

    if (element.viz_post_text) {
      englishText.push({
        text: element.viz_post_text.en,
        nodeName: "viz_post_text"
      });
    }

    if (element.card_post_text) {
      englishText.push({
        text: element.card_post_text.en,
        nodeName: "card_post_text"
      });
    }

    if (element.label) {
      englishText.push({ text: element.label.en, nodeName: "label" });
    }

    //  return;

    for (let enText of englishText) {
      const foundChoice = reference.find(el => {
        let firstCompare = el.en.toLowerCase();
        let secondCompare = enText.text.toString().toLowerCase();

        // Remove markup formatting
        firstCompare = firstCompare.replace(/\[/gi, "");
        firstCompare = firstCompare.replace(/\]\(title\)/gi, "");
        firstCompare = firstCompare.replace(/\]\(bold\)/gi, "");
        firstCompare = firstCompare.replace(/\]\]\%/gi, "");
        firstCompare = firstCompare.replace(/\[\[/gi, "");
        firstCompare = firstCompare.replace(/\%\{headlineCalc\}/gi, "x");
        firstCompare = firstCompare.replace(/\W/gi, "");

        secondCompare = secondCompare.replace(/\[/gi, "");
        secondCompare = secondCompare.replace(/\]\(title\)/gi, "");
        secondCompare = secondCompare.replace(/\]\(bold\)/gi, "");
        secondCompare = secondCompare.replace(/\%\{headlineCalc\}/gi, "x");
        secondCompare = secondCompare.replace(/\]\]\%/gi, "");
        secondCompare = secondCompare.replace(/\[\[/gi, "");
        secondCompare = secondCompare.replace(/\W/gi, "");

        return firstCompare === secondCompare;
      });

      const otherLang = this.node[enText.nodeName][OTHER_LANGUAGE];

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
          this.node[enText.nodeName][OTHER_LANGUAGE] =
            foundChoice[OTHER_LANGUAGE];

          // console.log(
          //   highlight(JSON.stringify(foundChoice), {
          //     language: "json",
          //     theme: `{
          //               "keyword": "blue",
          //               "built_in": ["cyan", "dim"],
          //               "string": "green",
          //               "default": "gray"
          //             }`
          //   })

          // );
          console.log(
            prettyjson.render(foundChoice, {
              keysColor: "brightYellow",
              dashColor: "magenta",
              stringColor: "brightMagenta"
            })
          );

          // console.log(
          //   highlight(YAML.stringify(this.node[enText.nodeName]), {
          //     language: "yaml",
          //     ignoreIllegals: true
          //   })
          // );

          console.log(
            highlight(
              jsyaml.safeDump(this.node[enText.nodeName], {
                lineWidth: 100000
              }),
              {
                language: "yaml",
                ignoreIllegals: true
              }
            )
          );
        }
      }
    }
  });

  if (logFilename) console.log(chalk.yellowBright("^^^^from " + file));
  logFilename = false;

  // Don't use these in production as can't guarantee compatability with system
  // fs.writeFileSync(
  //   "./out/" + file,
  //   jsyaml.safeDump(parsedYaml, {
  //     lineWidth: 100000
  //   })
  // );
}
