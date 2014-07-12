var values = [];
var fastExponent;
var slowExponent;
var signalExponent;
var fastEMA;
var slowEMA;
var pvoValues = [];
var pvoEMA;
var label;
var signalLabel;
var histogramLabel;

function onStart (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    validate("fastEMAPeriods", fastEMAPeriods);
    validate("slowEMAPeriods", slowEMAPeriods);
    
    if (fastEMAPeriods >= slowEMAPeriods) {
        error("Price Volume Oscillator slowEMAPeriods must be greater than fastEMAPeriods");
    }
        
    fastExponent = 2 / (fastEMAPeriods + 1);
    slowExponent = 2 / (slowEMAPeriods + 1);

    if (signalEMAPeriods) {

        validate("signalEMAPeriods", signalEMAPeriods);

        label = "Price Volume Oscillator (" + fastEMAPeriods + "," + slowEMAPeriods + "," + signalEMAPeriods + ")";
        signalLabel = label + " Signal";
        histogramLabel = label + " Histogram";

        signalExponent = 2 / (signalEMAPeriods + 1);
    }
}

function validate (fieldName, value) {
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

function getRunUpCount (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return slowEMAPeriods + signalEMAPeriods;
}

function onIntervalClose (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    var pvo;

    if (slowEMA !== undefined) {

        slowEMA =  ((VOLUME - slowEMA) * slowExponent) + slowEMA;
        fastEMA =  ((VOLUME - fastEMA) * fastExponent) + fastEMA;
        
    } else if (values.length === slowEMAPeriods) {
        
        slowEMA = Math.average(values);
        fastEMA = Math.average(values.slice(values.length - fastEMAPeriods));
        
    } else {

        values.push(VOLUME);
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