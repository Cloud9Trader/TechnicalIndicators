var closes = [],
    exponent,
    EMA;

function onStart (periods) {
    if (typeof periods !== "number") {
        error("EMA periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("EMA periods must be an integer");
    }
    if (periods > 100) {
        error("EMA maximum periods is 100");
    }
    if (periods <= 0) {
        error("EMA periods must be greater than 0");
    }
    exponent = 2 / (periods + 1);
}

function onIntervalClose (periods) {

    if (EMA === undefined) {

        closes.push(CLOSE);

        if (closes.length === periods) {

            // First value is SMA (ensure there is plenty of run up data before start)
            EMA = Math.average(closes);

        } else {
            return null;
        }

    } else {

        EMA = ((CLOSE - EMA) * exponent) + EMA;

    }

    return EMA;
}