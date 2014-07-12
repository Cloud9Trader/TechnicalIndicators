var emaExponent,
    previousClose,
    closes = [],
    trueRanges = [],
    averageTrueRange;

function getStudyAxisConfig () {
    return {
        gridLineWidth: 0,
        plotLines: [
            {value: -3, width: 1, color: "#EEE"},
            {value: 0, width: 1, color: "#EEE", dashStyle: "Dash"},
            {value: 3, width: 1, color: "#EEE"}
        ]
    };
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Pretty Good Oscillator periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Pretty Good Oscillator periods must be an integer");
    }
    if (periods > 100) {
        error("Pretty Good Oscillator maximum periods is 100");
    }
    if (periods <= 0) {
        error("Pretty Good Oscillator periods must be greater than zero");
    }
    emaExponent = 2 / (periods + 1);
}

function onIntervalClose (periods) {

    var trueRange;

    closes.push(CLOSE);

    if (!previousClose) {
        previousClose = CLOSE;
        return null;
    }
    
    trueRange = Math.max.apply(null, [
        HIGH - LOW,
        HIGH - previousClose,
        LOW - previousClose
    ]);

    previousClose = CLOSE;

    if (averageTrueRange === undefined) {
        trueRanges.push(trueRange);
        if (trueRanges.length === periods) {
            averageTrueRange = Math.average(trueRanges);
        }
    } else {
        averageTrueRange = ((trueRange - averageTrueRange) * emaExponent) + averageTrueRange;
    }

    if (closes < periods) {
        return null;
    } else if (closes > periods) {
        closes.shift();
    }

    return {
        overlay: false,
        value: (CLOSE - Math.average(closes)) / averageTrueRange
    };  
}