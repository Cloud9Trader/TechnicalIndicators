function getBufferSize (periods) {
    return periods;
}

function validate (periods, deviations) {
    if (typeof periods !== "number") {
        error("Bollinger Band %B periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Bollinger Band %B periods must be an integer");
    }
    if (periods > 100) {
        error("Bollinger Band %B maximum periods is 100");
    }
    if (periods <= 0) {
        error("Bollinger Band %B periods must be greater than zero");
    }
    if (typeof deviations !== "number") {
        error("Bollinger Band %B deviation multiplier must be a number");
    }
    if (typeof deviations <= 0) {
        error("Bollinger Band %B deviation multiplier must be greater than zero");
    }
}

function onIntervalClose (periods, deviations) {

    var bollingerValue = bollinger(periods, deviations),
        upperBand = bollingerValue[0][0],
        lowerBand = bollingerValue[0][1];

    return {
        overlay: false,
        value: (CLOSE - lowerBand) / (upperBand - lowerBand),
        tooltip: {
            valueDecimals: 2
        }
    };
}