function getBufferSize (periods) {
    return periods;
}

function validate (periods, deviations) {
    if (typeof periods !== "number") {
        error("Bollinger Bandwidth periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Bollinger Bandwidth periods must be an integer");
    }
    if (periods > 100) {
        error("Bollinger Bandwidth maximum periods is 100");
    }
    if (periods <= 0) {
        error("Bollinger Bandwidth periods must be greater than zero");
    }
    if (typeof deviations !== "number") {
        error("Bollinger Bandwidth deviation multiplier must be a number");
    }
    if (typeof deviations <= 0) {
        error("Bollinger Bandwidth deviation multiplier must be greater than zero");
    }
}

function onIntervalClose (periods, deviations) {
    
    var closePrices = prices(periods),
        SMA = Math.mean(closePrices),
        margin = Math.standardDeviation(closePrices) * deviations;

    return {
        overlay: false,
        value: ((margin * 2) / SMA) * 100,
        tooltip: {
            valueDecimals: 2
        }
    };
}