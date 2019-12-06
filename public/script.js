var freqMax = 8000;
var freqMin = 7000;
var powerMin = -140;
var powerMax = -50;
var colors = [[255, 0, 0], [255, 165, 0], [255, 191, 0], [132,222,2], [141,182,0], [31,117,254]];
var width = 800;
var height = 600;
var step = 10;

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
        var entries = [];
        var currentFreq = freqMin;
        for (var j = 0; j < numOfEntries; j++) {
            var freq = getRandomInt(currentFreq, freqMax);
            entries.push([freq, getRandomNum(powerMin, powerMax)]);
            currentFreq = freq;
        }

        m.push([new Date(), entries]); 
    }

    return m;
}

function scaleNumber(value, min, max, newMin, newMax) {
    var oldRange = (max - min);  
    var newRange = (newMax - newMin);  
    return (((value - min) * newRange) / oldRange) + newMin;
}

function scaleFreq(value) {
    return Math.round(scaleNumber(value, freqMin, freqMax, 0, width));
}

function getIndex(x, y) {
    return (y * (width * 4)) + (x * 4);
}

function getColor(value) {
    var colorIndex = Math.round(scaleNumber(value, powerMin, powerMax, 0, colors.length-1));
    return colors[colorIndex];
}

function setColors(freq, power, endFreq, imgData, row) {
    var c = getColor(power);
    var startX = scaleFreq(freq);
    var ymax = row + step;
    var endX = null;

    if (endFreq != null) {
        endX = scaleFreq(endFreq);
    } else {
        endX = width;
    }

    if (ymax > height) {
        ymax -= (ymax - height);
    }

    for(var x = startX; x < endX; x++) {        
        for(var y = row; y < ymax; y++) {
            var rindex = getIndex(x, y);
            imgData[rindex] = c[0];
            imgData[rindex + 1] = c[1];
            imgData[rindex + 2] = c[2];
            imgData[rindex + 3] = 255;
        }
    }
}

$(document).ready(function() {
    var ctx = $('#canvas')[0].getContext('2d');
    var measurements = generateMeasurements(1000, 100);
    var imgData = ctx.createImageData(width, height);
    console.log(imgData.data.length);

    for (var i = 0; i < measurements.length; i++) {
        var entries = measurements[i][1];
        for (var j = 0; j < entries.length; j++) {
            var freq = entries[j][0];
            var power = entries[j][1];
            var nextFreq = null;

            if ((j + 1) < entries.length) {
                nextFreq = entries[j+1][0];
            }

            setColors(freq, power, nextFreq, imgData.data, (i*step));
        }
    }
    
    /*for(var i = 0; i < imgData.data.length; i+=4) {
        imgData.data[i] = 255;
        imgData.data[i+1] = 0;
        imgData.data[i+2] = 0;
        imgData.data[i+3] = 255;
    }*/

    ctx.putImageData(imgData, 0, 0);
});
