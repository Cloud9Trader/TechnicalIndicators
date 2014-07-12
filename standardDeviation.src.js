var closes = [];

function getRunUpCount (periods) {
    return periods;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Standard Deviation (Volatility) periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Standard Deviation (Volatility) periods must be an integer");
    }
    if (periods > 100) {
        error("Standard Deviation (Volatility) maximum periods is 100");
    }
    if (periods <= 0) {
        error("Standard Deviation (Volatility) periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    closes.push(CLOSE);

    if (closes.length < periods) {
        return null;
    } else if (closes.length > periods) {
        closes.shift();
    }

    return {
        overlay: false,
        value: Math.standardDeviation(closes)
    };
}