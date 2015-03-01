var previousClose,
    buyingPressures = [],
    trueRanges = [];

function getRunUpCount (shortPeriods, mediumPeriods, longPeriods) {
    return longPeriods;
}

function getBufferSize (shortPeriods, mediumPeriods, longPeriods) {
    return 2;
}

function getStudyAxisConfig () {
    return {
        min: 0,
        max: 100,
        grdLineWidth: 0,
        plotLines: [
            {value: 30, color: "#EEE", width: 1},
            {value: 50, color: "#EEE", width: 1, dashStyle: "Dash"},
            {value: 70, color: "#EEE", width: 1}
        ]
    };
}

function validate (shortPeriods, mediumPeriods, longPeriods) {
    validateField("shortPeriods", shortPeriods);
    validateField("mediumPeriods", mediumPeriods);
    validateField("longPeriods", longPeriods);
    if (shortPeriods >= mediumPeriods) {
        error("Ultimate Oscillator mediumPeriods must be greater than shortPeriods");
    }
    if (mediumPeriods >= longPeriods) {
        error("Ultimate Oscillator longPeriods must be greater than mediumPeriods");
    }
}

function validateField (fieldName, value) {
    if (typeof value !== "number") {
        error("Ultimate Oscillator " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("Ultimate Oscillator " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("Ultimate Oscillator " + fieldName + " maximum is 100");
    }
    if (value <= 0) {
        error("Ultimate Oscillator " + fieldName + " must be greater than 0");
    }
}

function onIntervalClose (shortPeriods, mediumPeriods, longPeriods) {

    var previousClose = price(1),
        shortAverage,
        mediumAverage,
        longAverage;

    buyingPressures.push(CLOSE - Math.min(LOW, previousClose));
    trueRanges.push(Math.max(HIGH, previousClose) - Math.min(LOW, previousClose));

    if (buyingPressures.length < longPeriods) {
        return null;
    } else if (buyingPressures.length > longPeriods)  {
        buyingPressures.shift();
        trueRanges.shift();
    }

    shortAverage = Math.sum(buyingPressures.slice(buyingPressures.length - shortPeriods)) / Math.sum(trueRanges.slice(trueRanges.length - shortPeriods));
    mediumAverage = Math.sum(buyingPressures.slice(buyingPressures.length - mediumPeriods)) / Math.sum(trueRanges.slice(trueRanges.length - mediumPeriods));
    longAverage = Math.sum(buyingPressures) / Math.sum(trueRanges);

    return {
        overlay: false,
        value: 100 * ((4 * shortAverage) + (2 * mediumAverage) + longAverage) / 7
    };
}