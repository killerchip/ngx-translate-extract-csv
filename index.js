#!/usr/bin/env node
const version = "1.1.0";

var dot = require("dot-object");
var fs = require('fs');
var csv = require("fast-csv");

var basepath = process.cwd();

var usageMessage = `
Merge JSON files created with ngx-translate-extract to a single CSV file and vice versa.
--------
Usage:
  ngx-translate-extract-csv -l <languages> [-i <input path>] [-o <output path>] [-s <separator>]
  ngx-translate-extract-csv -r -i <input csv file> [-o <output path>] [-s <separator>]
  ngx-translate-extract-csv -h | --help
  ngx-translate-extract-csv -v | --version

  Options:
    <languages>   : comma separated values of the input json files. Assumes .json extension
    <input path>  : location of the .json files. Default "./src/assets/i18n"
    <output path> : the path of the output file. If ommited the results are printed in screen only.
    <separator>   : the separator character. Must be 1 character long. Defaults to "," (comma) separator.

    -r : Reverse operation. Split a CSV file to multiple JSON files.
    <input csv file>  : The CSV file to be processed
    <output path>     : The target folder in wich the .json files will be created. Default "./src/assets/i18n"
`;

function getArguments() {
  let params = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i].substring(0, 1) === "-") {
      if ( typeof process.argv[i + 1] !== "undefined" && process.argv[i + 1].substring(0, 1) !== "-") {
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


// Main Execution goes here

// React to easy parameter (version and help)
let params = getArguments();

if (params.hasOwnProperty("h") || params.hasOwnProperty("-help")) {
  console.log(usageMessage);
  process.exit(0);
}

if (params.hasOwnProperty("v") || params.hasOwnProperty("-version")) {
  console.log("version: "+version);
  process.exit(0);
}

var delimiter = params["s"] ? params["s"] : ",";
if (delimiter.length > 1) {
  console.log('Delimiter must be 1 character long');
  process.exit(1);
}

if (params.hasOwnProperty("r")) {

  //Reverse mode: CSV to JSON files

  if (params.hasOwnProperty("i")) {

    //set paths
    let sourcePath = params["i"];
    //check if input path to csv is defined
    if (sourcePath === "undefined" || sourcePath === null || sourcePath === "") {
      console.log(usageMessage);
      process.exit(0);
    }
    let destinationPath = params["o"] || "./src/assets/i18n";

    //Reading the stream
    let allLangsObject = {};
    csv
    .fromPath(`${basepath}/${sourcePath}`, {headers: true, ignoreEmpty: true, delimiter: delimiter})
    .on("data", function(data){
        //mix lines into a flat-object with 'lang' prepending the termId
        let termId=data["termID"];
        for (let key in data) {
          let dataval=data[key];
          if (key!=="termID") {
            allLangsObject[`${key}.${termId}`] = dataval;
          }
        }
    })
    .on("end", function(){
      //Give depth to the flat-object. 1st level of properties of the object are each language
      let depthedAllLangsObject = dot.object(allLangsObject);
      for (let lang in depthedAllLangsObject) {
        //write language specific object to language file
        let filepath = `${basepath}/${destinationPath}/${lang}.json`;
        var outputFile = fs.createWriteStream(filepath, {
          flags: 'w'
        });
        console.log(`Creating: ${filepath}`);
        outputFile.write(JSON.stringify(depthedAllLangsObject[lang],null,'\t'));
        outputFile.end();
      }
      console.log('Done...');
    });

  } else {
    console.log(usageMessage);
    process.exit(0);
  }
  let sourcePath = params["i"] || "./src/assets/i18n";
  let destinationPath = params["o"];
  let langsArg = params["l"];  

} else {

  // Forward mode: JSON files to CSV

  let sourcePath = params["i"] || "./src/assets/i18n";
  let destinationPath = params["o"];
  let langsArg = params["l"];

  if (
    typeof sourcePath !== "string" || sourcePath === ""
    || typeof langsArg !== "string" || langsArg === ""
    ) {
    console.log(usageMessage);
    process.exit(0);
  }

  let languages = langsArg.split(",");
  if (!Array.isArray(languages) || languages.length === 0) {
    console.log(usageMessage);
    process.exit(0);
  }

  // Read source files into a single CSV-ready object
  let tableObj = {};
  for (i = 0; i < languages.length; i++) {
    let langObj = require(basepath + "/" + sourcePath + "/" + languages[i] + ".json");
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
      header +=`${delimiter}"${lang}"`;
  }
  console.log(header);
  if (typeof destinationPath === "string") {
    outputFile.write(header+"\n");
  }
  let terms = Object.keys(tableObj);
  for (let term of terms) {
      let line = `"${term}"`;
      for (let lang of languages) {
          line += `${delimiter}"${tableObj[term][lang]}"`;
      }
      console.log(line);
      if (typeof destinationPath === "string") {
        outputFile.write(line+"\n");
      }
  }

  if (typeof destinationPath === "string") {
    outputFile.end();
  }

}





