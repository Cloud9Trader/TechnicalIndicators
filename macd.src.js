var values = [];
var fastExponent;
var slowExponent;
var signalExponent;
var fastEMA;
var slowEMA;
var macdValues = [];
var macdEMA;
var label;
var signalLabel;
var histogramLabel;

function onStart (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    validate("fastEMAPeriods", fastEMAPeriods);
    validate("slowEMAPeriods", slowEMAPeriods);
    
    if (fastEMAPeriods >= slowEMAPeriods) {
        error("MACD slowEMAPeriods must be greater than fastEMAPeriods");
    }
    
    fastExponent = 2 / (fastEMAPeriods + 1);
    slowExponent = 2 / (slowEMAPeriods + 1);

    if (!signalEMAPeriods) {
        return;
    }

    validate("signalEMAPeriods", signalEMAPeriods);

    label = "MACD(" + fastEMAPeriods + "," + slowEMAPeriods + "," + signalEMAPeriods + ")";
    histogramLabel = label + " Histogram";
    signalLabel = label + " Signal";

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
    
    var macd;

    if (slowEMA !== undefined) {
        
        slowEMA = (CLOSE * slowExponent) + (slowEMA * (1 - slowExponent));
        fastEMA = (CLOSE * fastExponent) + (fastEMA * (1 - fastExponent));
        
    } else {

        values.push(CLOSE);
        if (values.length === slowEMAPeriods) {
            slowEMA = Math.average(values);
            fastEMA = Math.average(values.slice(values.length - fastEMAPeriods));
        } else {
            return null;
        }
    }
    
    macd = fastEMA - slowEMA;

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