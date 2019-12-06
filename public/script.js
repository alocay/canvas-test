var freqMax = 8000;
var freqMin = 7000;
var powerMin = -140;
var powerMax = -50;
var colors = [[255, 0, 0], [255, 165, 0], [255, 191, 0], [132,222,2], [141,182,0], [31,117,254]];
var width = 800;
var height = 600;
var step = 5;

function getRandomNum(min, max) {
      return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateMeasurements(numOfMeas, numOfEntries) {
    var m = [];
    for(var i = 0; i < numOfMeas; i++) {
        var entries = []
        for (var j = 0; j < numOfEntries; j++) {
            entries.push([getRandomInt(freqMin, freqMax), getRandomNum(powerMin, powerMax)]);
        }

        m.push([new Date(), entries]); 
    }

    return m;
}

function scaleNumber(value, min, max, newMin, newMax) {
    var oldRange = (max - min);  
    var newRange = (newMax - newMin);  
    return (((value - oldMin) * newRange) / oldRange) + newMin;
}

function scaleFreq(value) {
    return scaleNumber(value, freqMin, freqMax, 0, width);
}

function getIndex(x, y) {
    return (y * (width * 4)) + (x * 4);
}

function getColor(value) {
    var colorIndex = scaleNumber(value, powerMin, powerMax, 0, colors.length-1);
    return colors[colorIndex];
}

function setColor(freq, power, imgData, y) {
    var c = getColor(power);
    var x = scaleFreq(freq);
    var ymax = y + step;

    if (ymax > height) {
        ymax -= (ymax - height);
    }

    for(var i = y; i < ymax; i++) {
        var rindex = getIndex(x, y);
        imgData[rindex] = c[0];
        imgData[rindex + 1] = c[1];
        imgData[rindex + 2] = c[2];
        imgData[rindex + 3] = 1;
    }
}

$(document).ready(function() {
    var ctx = $('#canvas')[0].getContext('2d');
    var imgData = ctx.getImageData(0, 0, width, height).data;
    var measurements = generateMeasurements(100, 5);
    
    for (var i = 0; i < measurements.length; i++) {
        var entries = measurements[i][1];
        for (var j = 0; j < entries.length; j++) {
            var freq = entries[0];
            var power = entries[1]
            setColors(freq, power, imgData, i);
        }
    }
});
