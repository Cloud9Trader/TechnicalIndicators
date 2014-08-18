var signalExponent,
    pvoValues = [],
    pvoEMA,
    label,
    signalLabel,
    histogramLabel;

function getRunUpCount (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return (slowEMAPeriods * 2) + (signalEMAPeriods || 0);
}

function validate (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    validateField("fastEMAPeriods", fastEMAPeriods);
    validateField("slowEMAPeriods", slowEMAPeriods);
    
    if (fastEMAPeriods >= slowEMAPeriods) {
        error("Price Volume Oscillator slowEMAPeriods must be greater than fastEMAPeriods");
    }

    if (signalEMAPeriods) {
        validateField("signalEMAPeriods", signalEMAPeriods);
    }
}

function validateField (fieldName, value) {
    if (typeof value !== "number") {
        error("Price Volume Oscillator " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("Price Volume Oscillator " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("Price Volume Oscillator " + fieldName + " maximum is 100");
    }
    if (value <= 0) {
        error("Price Volume Oscillator " + fieldName + " must be greater than 0");
    }
}

function onStart (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    if (signalEMAPeriods) {
        label = "Price Volume Oscillator (" + fastEMAPeriods + "," + slowEMAPeriods + "," + signalEMAPeriods + ")";
        signalLabel = label + " Signal";
        histogramLabel = label + " Histogram";
        signalExponent = 2 / (signalEMAPeriods + 1);
    }
}

function onIntervalClose (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    var fastEMA = ema(fastEMAPeriods),
        slowEMA = ema(slowEMAPeriods),
        pvo;

    if (!fastEMA || !slowEMA) {
        return null;
    }
    
    pvo = ((fastEMA - slowEMA) / slowEMA) * 100;

    if (!signalEMAPeriods) {
        return {
            value: pvo,
            overlay: false
        };
    }
    
    if (pvoEMA !== undefined) {
        pvoEMA = ((pvo - pvoEMA) * signalExponent) + pvoEMA;
    } else if (pvoValues.length === signalEMAPeriods) {
        pvoEMA = Math.average(pvoValues);
    } else {
        pvoValues.push(pvo);
        return null;
    }

    return [{
        name: label,
        value: pvo,
        overlay: false
    }, {
        name: signalLabel,
        value: pvoEMA,
        overlay: false
    }, {
        name: histogramLabel,
        value: pvo - pvoEMA,
        overlay: false,
        type: "column"
    }];
}