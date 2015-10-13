var k,
    WilderMA;

function getRunUpCount (periods) {
    return periods * 2;
}

function getBufferSize (periods) {
    return periods;
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("WilderMA periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("WilderMA periods must be an integer");
    }
    if (periods > 200) {
        error("WilderMA maximum periods is 200");
    }
    if (periods <= 0) {
        error("WilderMA periods must be greater than 0");
    }
}

function onStart (periods) {
    k = 1 / periods;
}

function onIntervalClose (periods) {
    if (WilderMA === undefined) {
        WilderMA = Math.average(prices(periods));
    } else {
        WilderMA = CLOSE * k + WilderMA * (1 - k);
    }
    return WilderMA;
}
