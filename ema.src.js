var exponent,
    EMA;

function getRunUpCount (periods) {
    return periods * 2;
}

function getBufferSize (periods) {
    return periods;
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("EMA periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("EMA periods must be an integer");
    }
    if (periods > 200) {
        error("EMA maximum periods is 200");
    }
    if (periods <= 0) {
        error("EMA periods must be greater than 0");
    }
}

function onStart (periods) {
    exponent = 2 / (periods + 1);  
}

function onIntervalClose (periods) {

    if (EMA === undefined) {
        EMA = Math.average(prices(periods));
    } else {
        EMA = ((CLOSE - EMA) * exponent) + EMA;
    }
    return EMA;
}