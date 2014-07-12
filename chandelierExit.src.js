var closes = [],
    previousClose,
    trueRangeValues = [],
    averageTrueRange,
    shortLabel,
    longLabel;


function getRunUpCount (periods, multiplier) {
    return periods;
}

function onStart (periods, multiplier) {
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
    shortLabel = "chandelierExit(" + periods + "," + multiplier + ") Short";
    longLabel = "chandelierExit(" + periods + "," + multiplier + ") Long";
}

function onIntervalClose (periods, multiplier) {

    var trueRange,
        highestHigh,
        lowestLow;

    if (!previousClose) {
        previousClose = CLOSE;
        return null;
    }
    
    closes.push(CLOSE);
    if (closes.length > periods) {
        closes.shift();
    }
    
    trueRange = Math.highest([
        HIGH - LOW,
        HIGH - previousClose,
        LOW - previousClose
    ]);
    
    previousClose = CLOSE;
    
    if (trueRangeValues.length < periods) {
        trueRangeValues.push(trueRange);
        
        if (trueRangeValues.length < periods) {
            return null;
        } else {
            averageTrueRange = Math.average(trueRangeValues);
            return null;
        }
    } else {
        averageTrueRange = ((averageTrueRange * (periods - 1)) + trueRange) / periods;
    }

    highestHigh = Math.highest(closes);
    lowestLow = Math.lowest(closes);
    
    return [{
        name: shortLabel,
        value: lowestLow + (averageTrueRange * multiplier)
    }, {
        name: longLabel,
        value: highestHigh - (averageTrueRange * multiplier)
    }];
}