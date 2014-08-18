function getRunUpCount (periods) {
    return periods * 2;
}

function getBufferSize () {
    return 0;
}

function validate (periods, envelope) {
    if (typeof periods !== "number") {
        error("EMA Envelope periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("EMA Envelope periods must be an integer");
    }
    if (periods > 100) {
        error("EMA Envelope maximum periods is 100");
    }
    if (periods <= 0) {
        error("EMA Envelope periods must be greater than 0");
    }
    if (envelope <= 0) {
        error("EMA Envelope envelope percent must be greater than zero");
    }
    if (envelope > 100) {
        error("EMA Envelope envelope percent must be below 100");
    }
}

function onIntervalClose (periods, envelope) {
    var EMA = ema(periods);
    return [EMA, [EMA - envelope, EMA + envelope]];
}