var emaExponent,
    forceIndices = [],
    forceIndexEMA;

function getBufferSize (periods) {
    return 2;
}

function getRunUpCount (periods) {
    return periods;
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("Force Index periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Force Index periods must be an integer");
    }
    if (periods > 100) {
        error("Force Index maximum periods is 100");
    }
    if (periods <= 0) {
        error("Force Index periods must be greater than zero");
    }
}

function onStart (periods) {
    emaExponent = 2 / (periods + 1);
}

function onIntervalClose (periods) {

    var forceIndex = (CLOSE - price(1)) * VOLUME;

    if (forceIndexEMA === undefined) {
        forceIndices.push(forceIndex);
        if (forceIndices.length === periods) {
            forceIndexEMA = Math.average(forceIndices);
        } else {
            return null;
        }
    } else {
        forceIndexEMA = ((forceIndex - forceIndexEMA) * emaExponent) + forceIndexEMA;
    }
    
    return {
        overlay: false,
        value: forceIndexEMA,
        type: "areaspline"
    };
}