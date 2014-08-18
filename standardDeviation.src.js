function getBufferSize (periods) {
    return periods;
}

function validate (periods) {
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
    return {
        overlay: false,
        value: Math.standardDeviation(prices(periods)) / INSTRUMENT.PIP_SIZE
    };
}