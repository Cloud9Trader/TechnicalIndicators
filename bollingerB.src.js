var values = [];

function getRunUpCount (periods) {
    return periods;
}

function onStart (periods, deviations) {
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
    var SMA,
        margin,
        closePrices,
        upperBand,
        lowerBand;

    // Push closing mid price to end of values array
    values.push(CLOSE);

    // We haven't got enough run up data to produce a value, so return null
    if (values.length < periods) {
        return null;
    }

    // Re-indexing array is slow, so rather than splicing dropped value from the beginning each time we just splice out old data every so often
    if (values.length > periods * 5) {
        values.splice(0, values.length - periods);
    }

    closePrices = values.slice(values.length - periods);
    SMA = Math.mean(closePrices);
    margin = Math.standardDeviation(closePrices) * deviations;
    upperBand = SMA + margin;
    lowerBand = SMA - margin;

    return {
        overlay: false,
        value: (CLOSE - lowerBand) / (upperBand - lowerBand),
        tooltip: {
            valueDecimals: 2
        }
    };
}
