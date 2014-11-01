var cp = require("child_process");

var Color = require("color");

var minPercent = 0.01;

cp.exec("convert test.jpg -colors 50 -format %c histogram:info:-", function(err, stdout) {
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

        total += count;

        matches.push({
            count: count,
            hsl: Color().rgb([r, g, b]).hslArray()
        });
    });

    matches.forEach(function(match) {
        match.percent = match.count / total;

        if (match.percent >= minPercent) {
            console.log(match.percent, match.hsl);
        }
    });
});