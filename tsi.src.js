var firstExponent,
    secondExponent,
    signalExponent,
    label,
    signalLabel,
    previousClose,
    priceChanges = [],
    absolutePriceChanges = [],
    firstEMA,
    firstAbsoluteEMA,
    firstEMAs = [],
    firstAbsoluteEMAs = [],
    secondEMA,
    secondAbsoluteEMA,
    TSIs = [],
    signal;

function onStart (firstPeriods, secondPeriods, signalPeriods) {
    validate("firstPeriods", firstPeriods);
    validate("secondPeriods", secondPeriods);

    firstExponent = 2 / (firstPeriods + 1);
    secondExponent = 2 / (secondPeriods + 1);
    signalExponent = 2 / (signalPeriods + 1);

    if (signalPeriods) {
        validate("signalPeriods", signalPeriods);
        label = "tsi(" + firstPeriods + "," + secondPeriods + "," + signalPeriods + ")";
        signalLabel = label + " Signal";
    }
}

function validate (fieldName, value) {
    if (typeof value !== "number") {
        error("True Strength Index " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("True Strength Index " + fieldName + " must be an integer");
    }
    if (value <= 0) {
        error("True Strength Index " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("True Strength Index " + fieldName + " maximum value is 100");
    }
}

function onIntervalClose (firstPeriods, secondPeriods, signalPeriods) {

    var priceChange,
        absolutePriceChange,
        TSI;

    if (previousClose === undefined) {
        previousClose = CLOSE;
        return null;
    }

    priceChange = CLOSE - previousClose;
    previousClose = CLOSE;
    
    absolutePriceChange = Math.abs(priceChange);

    if (firstEMA === undefined) {
        priceChanges.push(priceChange);
        absolutePriceChanges.push(absolutePriceChange);
        if (priceChanges.length === firstPeriods) {
            firstEMA = Math.average(priceChanges);
            firstAbsoluteEMA = Math.average(absolutePriceChanges);
        } else {
            return null;
        }
    } else {
        firstEMA = ((priceChange - firstEMA) * firstExponent) + firstEMA;
        firstAbsoluteEMA = ((absolutePriceChange - firstAbsoluteEMA) * firstExponent) + firstAbsoluteEMA;
    }

    if (secondEMA === undefined) {
        firstEMAs.push(firstEMA);
        firstAbsoluteEMAs.push(firstAbsoluteEMA);
        if (firstEMAs.length === secondPeriods) {
            secondEMA = Math.average(firstEMAs);
            secondAbsoluteEMA = Math.average(firstAbsoluteEMAs);
        } else {
            return null;
        }
    } else {
        secondEMA = ((firstEMA - secondEMA) * secondExponent) + secondEMA;
        secondAbsoluteEMA = ((firstAbsoluteEMA - secondAbsoluteEMA) * secondExponent) + secondAbsoluteEMA;
    }

    TSI = 100 * (secondEMA / secondAbsoluteEMA);

    if (!signalPeriods) {
        return {
            value: TSI,
            overlay: false
        };
    }

    if (signal === undefined) {
        TSIs.push(TSI);
        if (TSIs.length === signalPeriods) {
            signal = Math.average(TSIs);
        } else {
            return null;
        }
    } else {
        signal = ((TSI - signal) * signalExponent) + signal;
    }

    return [{
        name: label,
        value: TSI,
        overlay: false
    }, {
        name: signalLabel,
        value: signal,
        overlay: false
    }];
}