var dot = require("dot-object");
var fs = require('fs');

function getArguments() {
  let params = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].substring(0, 2) === "--") {
      if (process.argv[i + 1].substring(0, 2) !== "--") {
        params[process.argv[i].substring(2)] = process.argv[i + 1];
      } else {
        params[process.argv[i].substring(2)] = null;
      }
    }
  }
  return params;
}

function getParam(param, params) {
  if (params[param]) {
    return params[param];
  } else {
    return null;
  }
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

let params = getArguments();
let sourcePath = getParam("source", params);
let destinationPath = getParam("destination", params);
let languages = getParam("languages", params).split(",");

if (sourcePath === null) {
  console.log("Source path parameter is missing");
  process.exit(1);
}

if (destinationPath === null) {
  console.log("Destination path parameter is missing");
  process.exit(1);
}

if (languages === null) {
  console.log("Languages specification is missing");
  process.exit(1);
}

// Read source files into a single CSV-ready object
let tableObj = {};
for (i = 0; i < languages.length; i++) {
  let langObj = require(sourcePath + "/" + languages[i] + ".json");
  injectLangObject(languages[i], langObj, tableObj);
}



var outputFile = fs.createWriteStream(destinationPath, {
  flags: 'w'
})

//Print the CSV
let header = '"termID"';
for (let lang of languages) {
    header +=","+`"${lang}"`;
}
console.log(header);
outputFile.write(header);
let terms = Object.keys(tableObj);
for (let term of terms) {
    let line = `"${term}"`;
    for (let lang of languages) {
        line += `,"${tableObj[term][lang]}"`;
    }
    console.log(line);
    outputFile.write(line+"\n");
}
outputFile.end();




