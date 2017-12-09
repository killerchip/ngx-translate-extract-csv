# ngx-translate-extract to CSV

* Merges the .json files created by ngx-translate-extract into a single CSV file. 
* Splits the translated CSV file into separate .json files to be taken into use.

It helps with providing a format that can be easier handled by people that will perform the translation.

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
Usage:
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

**Example:** Splitting the CSV into json files.
We assume that input file is `./translation.csv` and we wish to output our files to `./tranlatedJson` folder.

```
ngx-translate-extract-csv -r -i ./translation.csv -o ./translatedJson
```


## License

_MIT:_

Copyright <2017> <Costas Ioannou (killerchip)>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
