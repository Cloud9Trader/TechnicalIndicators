var RSIs = [];

function getStudyAxisConfig () {
    return {
        tickPositions: [0, 0.2, 0.5, 0.8, 1]
    };
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("StochRSI periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("StochRSI periods must be an integer");
    }
    if (periods > 100) {
        error("StochRSI maximum periods is 100");
    }
    if (periods <= 0) {
        error("StochRSI periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    var RSI = rsi(periods),
        RSIPeriodLow;
    
    RSIs.push(RSI);

    if (RSIs.length < periods) {
        return null;
    } else if (RSIs.length > periods) {
        RSIs.shift();
    }

    RSIPeriodLow = Math.min.apply(null, RSIs);

    return {
        overlay: false,
        value: (RSI - RSIPeriodLow) / (Math.max.apply(null, RSIs) - RSIPeriodLow)
    };
}