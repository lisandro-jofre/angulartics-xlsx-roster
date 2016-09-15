#!/usr/bin/env node

// Dependencies.
var argv        = require("yargs").argv;
var fs          = require("fs");
var htmlparser  = require("htmlparser2");
var path        = require("path");
var recursive   = require("recursive-readdir");
var xlsx        = require("node-xlsx");

// Interface.
var aXLSXrI = [
    "analytics-on",
    "analytics-category",
    "analytics-event",
    "analytics-label",
    "file"
];

// Locals & defaults.
var dir         = path.resolve(process.cwd());
var dest        = argv.dest && argv.dest.length ? path.resolve(argv.dest) : dir;
var filename    = argv.filename && argv.filename.length ? argv.filename : "analytics";
var ignore      = argv.ignore && argv.ignore.length ? argv.ignore.split(",") : [];
var orderBy     = argv.orderBy && argv.orderBy.length ? aXLSXrI.indexOf(argv.orderBy) : 4;

// Throw error if --dest option is not an existing directory.
if (!fs.existsSync(dest)) {
    console.error("Sorry, the specified --dest option is not an existing directory.");
    return;
}

// Throw error if --orderBy option is not a valid value.
if (orderBy === -1) {
    console.error("Sorry, the specified --orderBy option is not a valid value.");
    return;
}

// Read current directory recursively.
recursive(dir, ignore, function(err, files) {

    if (files) {
        var workbook = [];
        var currentFile;

        // Set HTML parser.
        var parser = new htmlparser.Parser({
			
            // Parser for each file.
            onopentag: function(tag, attrs) {
				
                if (attrs[aXLSXrI[0]] || 
                    attrs[aXLSXrI[1]] ||
                    attrs[aXLSXrI[2]] || 
                    attrs[aXLSXrI[3]]) {
                    
                    // Push normalized analytics and current file into workbook if there's any angulartics attribute.
                    workbook.push([
                        attrs[aXLSXrI[0]] ? attrs[aXLSXrI[0]].replace(/[{{}}]/g, "").trim() : "", 
                        attrs[aXLSXrI[1]] ? attrs[aXLSXrI[1]].replace(/[{{}}]/g, "").trim() : "", 
                        attrs[aXLSXrI[2]] ? attrs[aXLSXrI[2]].replace(/[{{}}]/g, "").trim() : "", 
                        attrs[aXLSXrI[3]] ? attrs[aXLSXrI[3]].replace(/[{{}}]/g, "").trim() : "",
                        currentFile
                    ]);
                }
            },

            // Parser for the end of the buffer.
            onend: function() {

                if (!workbook.length) return;

                // Sort workbook.
                workbook.sort(function(a, b) {
                    if (a[orderBy] < b[orderBy]) return -1;
                    if (a[orderBy] > b[orderBy]) return 1;
                    return 0;
                });

                // Set workbook headers.
                workbook.unshift(aXLSXrI.map(function(header) {
                    return header.toUpperCase();
                }));
				
                // Write XLSX file.
                fs.writeFile(dest + "/" + filename + ".xlsx", xlsx.build([{
                    data: workbook
                }]), "utf8");
            }
        });

        // Parse HTML files.
        files.forEach(function(file) {
            if (path.extname(file) === ".html") {
                currentFile = dir.split(path.sep).pop() + file.replace(dir, "");
                parser.write(fs.readFileSync(path.resolve(file), "utf8"));
            }
        });
		
        // Parse the end of the buffer.
        parser.end();

        if (!workbook.length) {
            console.warn("No angulartics attributes found.");
        } else {
            console.log("Angulartics XLSX roster generated successfully.");
        }
    }
});
