var SMASeriesName;

function getBufferSize (periods) {
    return periods;
}

function validate (periods, deviations) {
    if (typeof periods !== "number") {
        error("Bollinger Bands periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Bollinger Bands periods must be an integer");
    }
    if (periods > 100) {
        error("Bollinger Bands maximum periods is 100");
    }
    if (periods <= 0) {
        error("Bollinger Bands periods must be greater than zero");
    }
    if (typeof deviations !== "number") {
        error("Bollinger Bands deviation multiplier must be a number");
    }
    if (typeof deviations <= 0) {
        error("Bollinger Bands deviation multiplier must be greater than zero");
    }
}

function onStart (periods, deviations) {
    SMASeriesName = "bollinger(" + periods + "," + deviations + ") mid";
}

function onIntervalClose (periods, deviations) {
    var SMA,
        margin,
        closePrices = prices(periods);

    SMA = Math.mean(closePrices);
    margin = Math.standardDeviation(closePrices) * deviations;
    
    return [[SMA - margin, SMA + margin], {
        value: SMA,
        dashStyle: "Dash",
        name: SMASeriesName,
    }];
}