var previousHigh,
    previousLow,
    previousClose,
    positiveMovements = [],
    negativeMovements = [],
    trueRanges = [],
    positiveLabel,
    negativeLabel;

function getRunUpCount (periods) {
    return periods;
}

function getStudyAxisConfig () {
    return {
        plotLines: [
            {value: 0.9, width: 1, color: "#EEE"},
            {value: 1.1, width: 1, color: "#EEE"}
        ]
    };
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Vortex Indicator periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Vortex Indicator periods must be an integer");
    }
    if (periods > 100) {
        error("Vortex Indicator maximum period is 100");
    }
    if (periods <= 0) {
        error("Vortex Indicator periods must be greater than 0");
    }
    positiveLabel = "vtx(" + periods + ") Positive";
    negativeLabel = "vtx(" + periods + ") Negative";
}

function onIntervalClose (periods) {

    var trueRangeSum;

    if (previousHigh === undefined) {
        previousHigh = HIGH;
        previousLow = LOW;
        previousClose = CLOSE;
        return null;
    }

    positiveMovements.push(HIGH - previousLow);
    negativeMovements.push(LOW - previousHigh);
    trueRanges.push(Math.max(HIGH - LOW, Math.abs(HIGH - previousClose), Math.abs(LOW - previousClose)));

    previousHigh = HIGH;
    previousLow = LOW;
    previousClose = CLOSE;

    if (positiveMovements.length < periods) {
        return null;
    } else if (positiveMovements.length > periods) {
        positiveMovements.shift();
        negativeMovements.shift();
        trueRanges.shift();
    }

    trueRangeSum = Math.sum(trueRanges);

    return [{
        name: negativeLabel,
        overlay: false,
        value: -Math.sum(negativeMovements) / trueRangeSum
    }, {
        name: positiveLabel,
        overlay: false,
        value: Math.sum(positiveMovements) / trueRangeSum
    }];
}