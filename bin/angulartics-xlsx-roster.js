#!/usr/bin/env node

// Dependencies.
var argv        = require("yargs").argv;
var fs          = require("fs");
var htmlparser  = require("htmlparser2");
var path        = require("path");
var recursive   = require("recursive-readdir");
var xlsx        = require("node-xlsx");

// Interface.
var analyticsI 	= [
    "analytics-on",
    "analytics-category",
    "analyitcs-event",
    "analytics-label"
];

// Locals.
var dir         = path.resolve(process.cwd());
var dest        = argv.dest ? path.resolve(argv.dest) : dir;
var filename    = argv.filename || "analytics";
var orderBy     = argv.orderBy ? analyticsI.indexOf(argv.orderBy) : 1;

// Read current directory recursively.
recursive(dir, function(err, files) {

    if (files) {
        var workbook = [];

        // Set HTML parser.
        var parser = new htmlparser.Parser({
			
            // Parser for each file.
            onopentag: function(tag, attrs) {
				
                if (attrs[analyticsI[0]] || 
                    attrs[analyticsI[1]] ||
                    attrs[analyticsI[2]] || 
                    attrs[analyticsI[3]]) {
                    
                    // Push analytics into workbook if there's any angulartics attribute.
                    workbook.push([
                        attrs[analyticsI[0]], 
                        attrs[analyticsI[1]], 
                        attrs[analyticsI[2]], 
                        attrs[analyticsI[3]]
                    ]);
                }
            },

            // Parser for the end of the buffer.
            onend: function() {

                // Sort workbook.
                workbook.sort(function(a, b) {
                    if (a[orderBy] < b[orderBy]) return -1;
                    if (a[orderBy] > b[orderBy]) return 1;
                    return 0;
                });

                // Set workbook header.
                workbook.unshift(analyticsI);
				
                // Write xlsx file.
                fs.writeFile(dest + "/" + filename + ".xlsx", xlsx.build([{
                    data: workbook
                }]), "utf8");
            }
        });

        // Parse HTML files.
        files.forEach(function(file) {
            if (path.extname(file) === ".html") {
                parser.write(fs.readFileSync(path.resolve(file), "utf8"));
            }
        });
		
        // Parse the end of the buffer.
        parser.end();
    }
});
