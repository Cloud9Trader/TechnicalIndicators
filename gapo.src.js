function validate (periods) {
    if (typeof periods !== "number") {
        error("Gopalakrishnan Range Index periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Gopalakrishnan Range Index periods must be an integer");
    }
    if (periods > 100) {
        error("Gopalakrishnan Range Index maximum periods is 100");
    }
    if (periods <= 0) {
        error("Gopalakrishnan Range Index periods must be greater than 0");
    }
}

function onIntervalClose (periods) {
    var highestHigh = Math.highest(prices.high(periods)),
        lowestLow = Math.lowest(prices.low(periods));
    return {
        overlay: false,
        value: Math.log(highestHigh - lowestLow) / Math.log(periods)
    };
}