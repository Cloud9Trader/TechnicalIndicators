var closes = [];

function getRunUpCount (periods) {
    return periods;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Price Channels periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Price Channels periods must be an integer");
    }
    if (periods > 100) {
        error("Price Channels maximum periods is 100");
    }
    if (periods <= 0) {
        error("Price Channels periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    var highestHigh,
        lowestLow;

    closes.push(CLOSE);

    if (closes.length < periods) {
        return null;
    } else if (closes.length > periods) {
        closes.shift();
    }

    highestHigh = Math.highest(closes);
    lowestLow = Math.lowest(closes);

    return [
        [lowestLow, highestHigh],
        {
            dashStyle: "Dash",
            value: (highestHigh + lowestLow) / 2
        }
    ];
}