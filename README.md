Translation Checker
===================
Check if translations are there. Quick and dirty script.

To use
------
Clone project.

Pull all files and create a folder called "files".

Run with: `node index.js`

It will print out all files that don't have matching languages.

Change languages with these lines:

```
const firstLanguage = /en: /g;
const secondLanguage = /zh: /g;
```
