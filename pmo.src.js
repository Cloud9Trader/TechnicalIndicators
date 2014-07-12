// TODO Investigate this one further to ensure producing correct results

var label,
    signalLabel,
    lastClose,
    firstEMAExponent,
    secondEMAExponent,
    signalEMAExponent,
    rateOfChanges = [],
    firstEMA,
    firstEMAs = [],
    pmo,
    pmos = [],
    signal;

function getRunUpCount (firstEMAPeriods, secondEMAPeriods, signalEMAPeriods) {
    return firstEMAPeriods + secondEMAPeriods + signalEMAPeriods + 1;
}

function onStart (firstEMAPeriods, secondEMAPeriods, signalEMAPeriods) {
    validate("firstEMAPeriods", firstEMAPeriods);
    validate("secondEMAPeriods", secondEMAPeriods);
    
    firstEMAExponent = 2 / (firstEMAPeriods + 1);
    secondEMAExponent = 2 / (secondEMAPeriods + 1);
    
    if (signalEMAPeriods) {
        validate("signalEMAPeriods", signalEMAPeriods);
        label = "PMO(" + firstEMAPeriods + "," + secondEMAPeriods + "," + signalEMAPeriods + ")";
        signalLabel = label + " Signal Line";
        signalEMAExponent = 2 / (signalEMAPeriods + 1);
    }
}

function validate (fieldName, value) {
    if (typeof value !== "number") {
        error("Price Momentum Oscillator " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("Price Momentum Oscillator " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("Price Momentum Oscillator " + fieldName + " maximum is 100");
    }
    if (value <= 0) {
        error("Price Momentum Oscillator " + fieldName + " must be greater than 0");
    }
}

function onIntervalClose (firstEMAPeriods, secondEMAPeriods, signalEMAPeriods) {
    
    var rateOfChange;
    
    if (!lastClose) {
        lastClose = CLOSE;
        return null;
    }
    
    rateOfChange = ((CLOSE / lastClose) * 100) - 100;
    
    if (firstEMA === undefined) {
        rateOfChanges.push(rateOfChange);
        if (rateOfChanges.length === firstEMAPeriods) {
            firstEMA = Math.average(rateOfChanges);
        } else {
            return null;
        }
    } else {
        firstEMA = ((rateOfChange - firstEMA) * firstEMAExponent) + firstEMA;
    }
    
    
    if (pmo === undefined) {
        firstEMAs.push(10 * firstEMA);
        if (firstEMAs.length === secondEMAPeriods) {
            pmo = Math.average(firstEMAs);
        } else {
            return null;
        }
    } else {
        pmo = (((10 * firstEMA) - pmo) * secondEMAExponent) + pmo;
    }

    if (!signalEMAPeriods) {
        return {
            overlay: false,
            value: pmo
        };
    }
    
    if (signal === undefined) {
        pmos.push(pmo);
        if (pmos.length === signalEMAPeriods) {
            signal = Math.average(pmos);
        } else {
            return null;
        }
    } else {
        signal = ((pmo - signal) * signalEMAExponent) + signal;
    }
    
    return [{
        name: label,
        overlay: false,
        value: pmo
    }, {
        name: signalLabel,
        overlay: false,
        value: signal
    }];
}