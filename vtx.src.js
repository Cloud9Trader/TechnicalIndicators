var positiveMovements = [],
    negativeMovements = [],
    trueRanges = [],
    positiveLabel,
    negativeLabel;

function getRunUpCount (periods) {
    return periods;
}

function getBufferSize (periods) {
    return 1;
}

function getStudyAxisConfig () {
    return {
        plotLines: [
            {value: 0.9, width: 1, color: "#EEE"},
            {value: 1.1, width: 1, color: "#EEE"}
        ]
    };
}

function validate (periods) {
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
}

function onStart (periods) {
    positiveLabel = "vtx(" + periods + ") Positive";
    negativeLabel = "vtx(" + periods + ") Negative";
}

function onIntervalClose (periods) {

    var previousClose = price.close(1),
        trueRangeSum;

    positiveMovements.push(HIGH - price.low(1));
    negativeMovements.push(LOW - price.high(1));
    trueRanges.push(Math.max(HIGH - LOW, Math.abs(HIGH - previousClose), Math.abs(LOW - previousClose)));

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