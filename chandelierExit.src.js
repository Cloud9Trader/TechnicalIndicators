var shortLabel,
    longLabel;

function getRunUpCount (periods) {
    return periods * 2;
}

function getBufferSize (periods) {
    return periods;
}

function validate (periods, multiplier) {
    if (typeof periods !== "number") {
        error("Chandelier Exit periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Chandelier Exit periods must be an integer");
    }
    if (periods > 100) {
        error("Chandelier Exit maximum periods is 100");
    }
    if (periods <= 0) {
        error("Chandelier Exit periods must be greater than zero");
    }
    if (typeof multiplier !== "number") {
        error("Chandelier Exit multiplier must be a number");
    }
    if (multiplier <= 0) {
        error("Chandelier Exit multiplier must be greater than zero");
    }
}

function onStart (periods, multiplier) {
    shortLabel = "chandelierExit(" + periods + "," + multiplier + ") Short";
    longLabel = "chandelierExit(" + periods + "," + multiplier + ") Long";
}

function onIntervalClose (periods, multiplier) {

    var averageTrueRange = atr(periods),
        closes = prices(periods),
        highestHigh = Math.highest(closes),
        lowestLow = Math.lowest(closes);
    
    return [{
        name: shortLabel,
        value: lowestLow + (averageTrueRange * multiplier)
    }, {
        name: longLabel,
        value: highestHigh - (averageTrueRange * multiplier)
    }];
}