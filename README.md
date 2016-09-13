[![npm version](https://badge.fury.io/js/angulartics-xlsx-roster.svg)](https://badge.fury.io/js/angulartics-xlsx-roster)
[![dependencies Status](https://david-dm.org/lisandro-jofre/angulartics-xlsx-roster/status.svg)](https://david-dm.org/lisandro-jofre/angulartics-xlsx-roster)

# angulartics-xlsx-roster

A CLI tool that recursively searches the current working directory for angulartics attributes in HTML files and generates an XLSX roster.

## Installation

```$ npm install -g angulartics-xlsx-roster```

## Usage

1. Open a terminal. 
2. Go to the project directory that you want to generate the roster for.
3. Run ```angulartics-xlsx-roster```. 

An XLSX file with the angulartics roster will be generated.

## Options

### --dest

*Default: current working directory.*</br>
The directory where the angulartics roster will be generated.

### --filename

*Default: analytics.xlsx*</br>
The name of the generated XLSX file.

### --ignore

The directories, files or patterns to ignore separated by commas.

### --orderBy

*Default: analytics-category*</br>
The order of the angulartics roster.</br>
Possible values: analytics-on, analytics-category, analytics-event and analytics-label.

## License

[MIT](LICENSE)
