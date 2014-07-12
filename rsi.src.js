var changes = [],
    lastClose,
    previousAverageGain,
    previousAverageLoss;

function getStudyAxisConfig () {
    return {
        tickPositions: [0, 30, 70, 100]
    };
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("RSI periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("RSI periods must be an integer");
    }
    if (periods > 100) {
        error("RSI maximum periods is 100");
    }
    if (periods <= 0) {
        error("RSI periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    var currentGain = 0,
        currentLoss = 0,
        relativeStrength,
        relativeStrengthIndex;
    
    if (previousAverageGain === undefined) {
        if (!lastClose) {
            changes.push(CLOSE - OPEN);
        } else {
            changes.push(CLOSE - lastClose);
        }
        lastClose = CLOSE;
        if (changes.length < periods) {
            return null;
        }
        if (changes.length > periods) {
            changes.shift();
        }
        previousAverageGain = changes.reduce(function (memo, change) {
            if (change > 0) {
                return memo + change;
            } else {
                return 0;
            }
        }, 0) / periods;
        previousAverageLoss = changes.reduce(function (memo, change) {
            if (change < 0) {
                return memo + Math.abs(change);
            } else {
                return 0;
            }
        }, 0) / periods;
    } else {
        
        if (CLOSE > lastClose) {
            currentGain = CLOSE - lastClose;
        } else {
            currentLoss = lastClose - CLOSE;
        }
        
        lastClose = CLOSE;
        
        previousAverageGain = ((previousAverageGain * (periods - 1)) + currentGain) / periods;
        previousAverageLoss = ((previousAverageLoss * (periods - 1)) + currentLoss) / periods;
    
    }
    
    if (previousAverageLoss === 0) {
        // Avoid divide by zero scenario
        relativeStrengthIndex = 100;
    } else {
        relativeStrength = previousAverageGain / previousAverageLoss;
        relativeStrengthIndex = 100 - (100 / (1 + relativeStrength));
    }
    
    return {
        overlay: false,
        value: relativeStrengthIndex,
        precision: 1
    };
}