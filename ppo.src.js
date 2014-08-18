var signalExponent,
    ppoValues = [],
    ppoEMA,
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
        error("Price Percentage Oscillator slowEMAPeriods must be greater than fastEMAPeriods");
    }
        
    if (signalEMAPeriods) {
        validateField("signalEMAPeriods", signalEMAPeriods);
    }
}

function validateField (fieldName, value) {
    if (typeof value !== "number") {
        error("Price Percentage Oscillator " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("Price Percentage Oscillator " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("Price Percentage Oscillator " + fieldName + " maximum is 100");
    }
    if (value <= 0) {
        error("Price Percentage Oscillator " + fieldName + " must be greater than 0");
    }
}

function onStart (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {

    if (signalEMAPeriods) {

        label = "Price Percentage Oscillator (" + fastEMAPeriods + "," + slowEMAPeriods + "," + signalEMAPeriods + ")";
        signalLabel = label + " Signal";
        histogramLabel = label + " Histogram";

        signalExponent = 2 / (signalEMAPeriods + 1);
    }
}

function onIntervalClose (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    var fastEMA = ema(fastEMAPeriods),
        slowEMA = ema(slowEMAPeriods),
        ppo;

    if (!fastEMA || !slowEMA) {
        return null;
    }

    ppo = ((fastEMA - slowEMA) / slowEMA) * 100;

    if (!signalEMAPeriods) {
        return {
            value: ppo,
            overlay: false
        };
    }
    
    if (ppoEMA !== undefined) {
        ppoEMA = ((ppo - ppoEMA) * signalExponent) + ppoEMA;
    } else if (ppoValues.length === signalEMAPeriods) {
        ppoEMA = Math.average(ppoValues);
    } else {
        ppoValues.push(ppo);
        return null;
    }

    return [{
        name: histogramLabel,
        value: ppo - ppoEMA,
        overlay: false,
        type: "column"
    }, {
        name: signalLabel,
        value: ppoEMA,
        overlay: false
    }, {
        name: label,
        value: ppo,
        overlay: false
    }];
}