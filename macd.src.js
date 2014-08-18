var signalExponent,
    macdValues = [],
    macdEMA,
    label,
    signalLabel,
    histogramLabel;

function getRunUpCount (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return (slowEMAPeriods * 2) + (signalEMAPeriods || 0);
}

function getBufferSize (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return 0;
}

function validate (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    validateField("fastEMAPeriods", fastEMAPeriods);
    validateField("slowEMAPeriods", slowEMAPeriods);
    if (fastEMAPeriods >= slowEMAPeriods) {
        error("MACD slowEMAPeriods must be greater than fastEMAPeriods");
    }
    if (signalEMAPeriods) {
        validateField("signalEMAPeriods", signalEMAPeriods);
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
    label = "MACD(" + fastEMAPeriods + "," + slowEMAPeriods + "," + signalEMAPeriods + ")";
    histogramLabel = label + " Histogram";
    signalLabel = label + " Signal";
    if (signalEMAPeriods) {
        signalExponent = 2 / (signalEMAPeriods + 1);
    }
}

function onIntervalClose (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    var macd = (ema(fastEMAPeriods) - ema(slowEMAPeriods)) / INSTRUMENT.PIP_SIZE;

    if (!signalEMAPeriods) {
        return {
            value: macd,
            overlay: false
        };
    }
    
    if (macdEMA !== undefined) {
        macdEMA = (macd * signalExponent) + (macdEMA * (1 - signalExponent));
    } else {
        macdValues.push(macd);
        if (macdValues.length === signalEMAPeriods) {
            macdEMA = Math.average(macdValues);
        } else {
            return null;
        }
    }

    return [{
        name: label,
        value: macd,
        overlay: false
    }, {
        name: signalLabel,
        value: macdEMA,
        overlay: false
    }, {
        name: histogramLabel,
        value: macd - macdEMA,
        overlay: false,
        type: "column"
    }];
}