function getBufferSize (periods) {
    return periods;
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("Williams %R periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Williams %R periods must be an integer");
    }
    if (periods > 100) {
        error("Williams %R maximum period is 100");
    }
    if (periods <= 0) {
        error("Williams %R periods must be greater than 0");
    }
}

function getStudyAxisConfig () {
    return {
        min: 0,
        max: 100,
        tickPositions: [-100, -80, -20, 0]
    };
}

function onIntervalClose (periods) {
    
    var closes = prices(periods),
        highestHigh = Math.max.apply(null, closes),
        lowestLow = Math.min.apply(null, closes);

    return [{
        overlay: false,
        value: ((highestHigh - CLOSE) / (highestHigh - lowestLow)) * -100,
        precision: 1
    }];
}