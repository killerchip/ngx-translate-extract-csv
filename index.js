#!/usr/bin/env node

var dot = require("dot-object");
var fs = require('fs');

function getArguments() {
  let params = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].substring(0, 1) === "-") {
      if (process.argv[i + 1].substring(0, 1) !== "-") {
        params[process.argv[i].substring(1)] = process.argv[i + 1];
      } else {
        params[process.argv[i].substring(1)] = null;
      }
    }
  }
  return params;
}

function injectLangObject(lang, langObj, tableObj) {
  let flatened = dot.dot(langObj);
  let keys = Object.keys(flatened);
  for (let key of keys) {
      let source = flatened[key];
      if (typeof tableObj[key] !== "undefined") {
          tableObj[key][lang] = source;
      } else {
          tableObj[key] = {};
          tableObj[key][lang] = source;
      }
  }
}

var usageMessage = `Error`;

let params = getArguments();
let sourcePath = params["i"] || "./src/assets/i18n";
let destinationPath = params["o"];
let langsArg = params["l"];

if (
  typeof sourcePath !== "string" || sourcePath === ""
  || typeof langsArg !== "string" || langsArg === ""
  ) {
  console.log(usageMessage);
  process.exit(1);
}

let languages = langsArg.split(",");
if (!Array.isArray(languages) || languages.length === 0) {
  console.log(usageMessage);
  process.exit(1);
}

// Read source files into a single CSV-ready object
let tableObj = {};
for (i = 0; i < languages.length; i++) {
  let langObj = require(sourcePath + "/" + languages[i] + ".json");
  injectLangObject(languages[i], langObj, tableObj);
}

if (typeof destinationPath === "string") {
  var outputFile = fs.createWriteStream(destinationPath, {
    flags: 'w'
  })  
}

//Print the CSV
let header = '"termID"';
for (let lang of languages) {
    header +=","+`"${lang}"`;
}
console.log(header);
if (typeof destinationPath === "string") {
  outputFile.write(header);
}
let terms = Object.keys(tableObj);
for (let term of terms) {
    let line = `"${term}"`;
    for (let lang of languages) {
        line += `,"${tableObj[term][lang]}"`;
    }
    console.log(line);
    if (typeof destinationPath === "string") {
      outputFile.write(line+"\n");
    }
}

if (typeof destinationPath === "string") {
  outputFile.end();
}




