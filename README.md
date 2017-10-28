#ngx-translate-extract-csv

Merges the .json files created by ngx-translate-extract into a single CSV file. It helps with providing an
format that can be easier handled by the translators.

_Note:_ It works only with files that were created separated, one .json file per language.

**Example**

For example, using ngx-translate-extract command the following files were created:

en.json
```
{
    "prop1": {
        "prop2": {
            "prop3": "english, string"
        }
    },
    "root": "root",
    "elonly": "",
    "enonly": "english"
}
```

el.json
```
{
    "prop1": {
        "prop2": {
            "prop3": "greek,string"
        }
    },
    "root": "riza",
    "enonly": "",
    "elonly": "greek"
}
```

It will produce the following CSV:
```
"termID","en","el"
"prop1.prop2.prop3","english, string","greek,string"
"root","root","riza"
"elonly","","greek"
"enonly","english",""
```

## Installation

Install using npm:
```
npm install ngx-translate-extract-csv --save-dev
```

Create a "scripts" entry in package.json

```
...
scripts: {
    "extract:csv" : "ngx-translate-extract-csv ..."
}
```

## Usage

```
  ngx-translate-extract-csv -l <languages> [-i <input path>] [-o <output path>]
  ngx-translate-extract-csv -h | --help

  Options:
    <languages>   : comma separated values of the input json files. Assumes .json extension
    <input path>  : location of the .json files. Default "./src/assets/i18n"
    <output path> : the path of the output file. If ommited the results are printed in screen only.
```

**Example:** Base usage

By default, it is assumed that language files are located in `./src/assets/i18n`.
The user has created `en.json` and `el.json`.

The following command will only print the results in screen:
```
ngx-translate-extract-csv -l en,el
```

**Example:** Defining an output file
```
ngx-translate-extract-csv -o extracted/translation.csv -l en,el
```

**Example:** Defining an input directory
```
ngx-translate-extract-csv -i ./lang-files -o ./output.csv -l en,el
```

