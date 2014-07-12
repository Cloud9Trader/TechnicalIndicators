var values = [];
var fastExponent;
var slowExponent;
var signalExponent;
var lastFastEMA;
var lastSlowEMA;
var MACDValues = [];
var lastMACDEMA;
var histogramLabel;

function onStart (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    validate("fastEMAPeriods", fastEMAPeriods);
    validate("slowEMAPeriods", slowEMAPeriods);
    validate("signalEMAPeriods", signalEMAPeriods);
    if (fastEMAPeriods >= slowEMAPeriods) {
        error("MACD slowEMAPeriods must be greater than fastEMAPeriods");
    }
    
    histogramLabel = "MACD(" + fastEMAPeriods + "," + slowEMAPeriods + "," + signalEMAPeriods + ")" + " Histogram";
        
    fastExponent = 2 / (fastEMAPeriods + 1);
    slowExponent = 2 / (slowEMAPeriods + 1);
    signalExponent = 2 / (signalEMAPeriods + 1);
}

function validate (fieldName, value) {
    
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

function getRunUpCount (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return slowEMAPeriods + signalEMAPeriods;
}

function onIntervalClose (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    var MACD;

    if (lastSlowEMA !== undefined) {
        
        lastSlowEMA =  (CLOSE * slowExponent) + (lastSlowEMA * (1 - slowExponent));
        lastFastEMA =  (CLOSE * fastExponent) + (lastFastEMA * (1 - fastExponent));
        
    } else {

        values.push(CLOSE);
        if (values.length === slowEMAPeriods) {
            lastSlowEMA = Math.average(values);
            lastFastEMA = Math.average(values.slice(values.length - fastEMAPeriods));
        } else {
            return null;
        }
    }
    
    MACD = lastFastEMA - lastSlowEMA;

    if (lastMACDEMA !== undefined) {
        lastMACDEMA = (MACD * signalExponent) + (lastMACDEMA * (1 - signalExponent));
    } else {
        MACDValues.push(MACD);
        if (MACDValues.length === signalEMAPeriods) {
            lastMACDEMA = Math.average(MACDValues);
        } else {
            return null;
        }
    }

    return {
        name: histogramLabel,
        value: MACD - lastMACDEMA,
        overlay: false,
        type: "column"
    };
}