var values = [];
var fastExponent;
var slowExponent;
var signalExponent;
var fastEMA;
var slowEMA;
var ppoValues = [];
var ppoEMA;
var label;
var signalLabel;
var histogramLabel;


function onStart (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    validate("fastEMAPeriods", fastEMAPeriods);
    validate("slowEMAPeriods", slowEMAPeriods);
    
    if (fastEMAPeriods >= slowEMAPeriods) {
        error("Price Percentage Oscillator slowEMAPeriods must be greater than fastEMAPeriods");
    }
        
    fastExponent = 2 / (fastEMAPeriods + 1);
    slowExponent = 2 / (slowEMAPeriods + 1);

    if (signalEMAPeriods) {

        validate("signalEMAPeriods", signalEMAPeriods);

        label = "Price Percentage Oscillator (" + fastEMAPeriods + "," + slowEMAPeriods + "," + signalEMAPeriods + ")";
        signalLabel = label + " Signal";
        histogramLabel = label + " Histogram";

        signalExponent = 2 / (signalEMAPeriods + 1);
    }
}

function validate (fieldName, value) {
    
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

function getRunUpCount (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    return slowEMAPeriods + signalEMAPeriods;
}

function onIntervalClose (fastEMAPeriods, slowEMAPeriods, signalEMAPeriods) {
    
    var ppo;

    if (slowEMA !== undefined) {

        slowEMA =  ((CLOSE - slowEMA) * slowExponent) + slowEMA;
        fastEMA =  ((CLOSE - fastEMA) * fastExponent) + fastEMA;
        
    } else if (values.length === slowEMAPeriods) {
        
        slowEMA = Math.average(values);
        fastEMA = Math.average(values.slice(values.length - fastEMAPeriods));
        
    } else {

        values.push(CLOSE);
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