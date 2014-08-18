var histogramLabel;

function getRunUpCount (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return (slowEMAPeriods * 2) + (signalEMAPeriods || 0);
}

function getBufferSize (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return 0;
}

function validate (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    validateField("fastEMAPeriods", fastEMAPeriods);
    validateField("slowEMAPeriods", slowEMAPeriods);
    validateField("signalEMAPeriods", signalEMAPeriods);
    if (fastEMAPeriods >= slowEMAPeriods) {
        error("MACD slowEMAPeriods must be greater than fastEMAPeriods");
    }
}

function validateField (fieldName, value) {
    if (typeof value !== "number") {
        error("MACD " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("MACD " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("MACD " + fieldName + " maximum is 100");
    }
    if (value <= 0) {
        error("MACD " + fieldName + " must be greater than 0");
    }
}

function onStart (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    histogramLabel = "MACD (" + fastEMAPeriods + "," + slowEMAPeriods + "," + signalEMAPeriods + ")" + " Histogram";
}

function getRunUpCount (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return slowEMAPeriods + signalEMAPeriods;
}

function onIntervalClose (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    var MACD = macd(fastEMAPeriods, slowEMAPeriods, signalEMAPeriods);

    return MACD ? {
        name: histogramLabel,
        value: MACD[0] - MACD[1],
        overlay: false,
        type: "column"
    } : null;
}