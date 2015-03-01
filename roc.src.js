function getBufferSize (periods) {
    return periods + 1;
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("Rate Of Change periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Rate Of Change periods must be an integer");
    }
    if (periods > 100) {
        error("Rate Of Change maximum periods is 100");
    }
    if (periods <= 0) {
        error("Rate Of Change periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    var periodStartClose = price(periods);
    
    return {
        overlay: false,
        value: ((CLOSE - periodStartClose) / periodStartClose) * 100
    };
}