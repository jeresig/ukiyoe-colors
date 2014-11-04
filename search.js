
console.log("Loading in JSON data...");

var items = require("./bm-colors2.json");

var color = [15,67,43];
var hMin = color[0] - 10;
var hMax = color[0] + 10;
var sMin = color[1] - 10;
var sMax = color[1] + 10;
var lMin = color[2] - 10;
var lMax = color[2] + 10;

var matches = {};

for (var file in items) {
    var colors = items[file];
    var score = 0;

    for (var i = 0, l = colors.length; i < l; i++) {
        var curColor = colors[i].hsl;
        var curH = curColor[0];
        var curS = curColor[1];
        var curL = curColor[2];
        if (curH >= hMin && curH <= hMax &&
            curS >= sMin && curS <= sMax &&
            curL >= lMin && curL <= lMax) {
                score += colors[i].match;
        }
    }

    if (score > 0) {
        matches[file] = score;
    }
}

Object.keys(matches).sort(function(a, b) {
    return matches[a] - matches[b];
}).forEach(function(file) {
    console.log(matches[file], file);
});