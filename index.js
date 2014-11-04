var cp = require("child_process");
var fs = require("fs");
var path = require("path");
var util = require("util");

var async = require("async");
var Color = require("color");
var JSONStream = require("JSONStream");

var dir = process.argv[2];
var minPercent = 0.01;
var minMaxSV = 10;
var processes = 2;

var cmd = "convert %s -ordered-dither threshold,8,8,8 -format %c histogram:info:-";

var files = fs.readdirSync(dir);
var stream = JSONStream.stringifyObject();

stream.pipe(process.stdout);

async.eachLimit(files, processes, function(file, callback) {
    var filePath = path.join(dir, file);
    cp.exec(util.format(cmd, filePath), function(err, stdout) {
        var total = 0;
        var matches = [];

        stdout.split("\n").forEach(function(line) {
            if (!/^\s*(\d+): \(\s*(\d+),\s*(\d+),\s*(\d+)\)/.test(line)) {
                return;
            }

            var count = parseFloat(RegExp.$1);
            var r = RegExp.$2;
            var g = RegExp.$3;
            var b = RegExp.$4;

            var hsl = Color().rgb([r, g, b]).hslArray();
            var s = hsl[1];
            var l = hsl[2];

            if (s <= minMaxSV || s >= (100 - minMaxSV) ||
                l <= minMaxSV || l >= (100 - minMaxSV)) {
                    return;
            }

            total += count;

            matches.push({
                count: count,
                hsl: hsl
            });
        });

        matches = matches.map(function(match) {
            var percent = parseFloat((match.count / total).toFixed(3));

            if (percent >= minPercent) {
                return {
                    hsl: match.hsl,
                    match: percent
                };
            }
        }).filter(function(match) {
            return !!match;
        });

        stream.write([filePath, matches]);

        callback();
    });
}, function() {
    stream.end();
});

