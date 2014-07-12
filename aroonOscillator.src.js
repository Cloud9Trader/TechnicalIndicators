var closes = [];

function getRunUpCount (periods) {
    return periods;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Aroon Oscillator periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Aroon Oscillator periods must be an integer");
    }
    if (periods > 100) {
        error("Aroon Oscillator maximum periods is 100");
    }
    if (periods <= 0) {
        error("Aroon Oscillator periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    var highestHigh,
        lowestLow,
        highIndex,
        lowIndex,
        aroonUp,
        aroonDown;

    closes.push(CLOSE);

    if (closes.length < periods) {
        return null;
    } else if (closes.length > periods) {
        closes.shift();
    }

    closes.forEach(function (closePrice, index) {
        if (!highestHigh || closePrice > highestHigh) {
            highestHigh = closePrice;
            highIndex = index;
        }
        if (!lowestLow || closePrice < lowestLow) {
            lowestLow = closePrice;
            lowIndex = index;
        }
    });
    
    aroonUp = (highIndex / (periods - 1)) * 100;
    aroonDown = (lowIndex / (periods - 1)) * 100;

    return {
        value: aroonUp - aroonDown,
        type: "area",
        overlay: false,
        tooltip: {
            valueDecimals: 1
        }
    };
}