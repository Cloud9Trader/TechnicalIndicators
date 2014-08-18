function getBufferSize (periods) {
    return periods;
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("SMA periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("SMA periods must be an integer");
    }
    if (periods > 100) {
        error("SMA maximum periods is 100");
    }
    if (periods <= 0) {
        error("SMA periods must be greater than zero");
    }
}

function onIntervalClose (periods) {
    return Math.average(prices(periods));
}