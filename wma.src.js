function getBufferSize (periods) {
    return periods;
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("WMA periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("WMA periods must be an integer");
    }
    if (periods > 100) {
        error("WMA maximum periods is 100");
    }
    if (periods <= 0) {
        error("WMA periods must be greater than 0");
    }
}

function onIntervalClose (periods) {

    var closes = prices(periods),
        nominator = 0;

    closes.forEach(function (value, index) {
        nominator += value * (index + 1);
    });

    // Divide by triangular number of periods
    return nominator / ((periods / 2) * (periods + 1));
}