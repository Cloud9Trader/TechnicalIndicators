var firstExponent,
    secondExponent,
    signalExponent,
    label,
    signalLabel,
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

function getRunUpCount (firstPeriods, secondPeriods, signalPeriods) {
    return (firstPeriods + secondPeriods + (signalPeriods || 0)) * 2;
}

function getBufferSize (firstPeriods, secondPeriods, signalPeriods) {
    return 2;
}

function validate (firstPeriods, secondPeriods, signalPeriods) {
    validateField("firstPeriods", firstPeriods);
    validateField("secondPeriods", secondPeriods);
    if (signalPeriods) {
        validateField("signalPeriods", signalPeriods);
    }
}

function onStart (firstPeriods, secondPeriods, signalPeriods) {
    firstExponent = 2 / (firstPeriods + 1);
    secondExponent = 2 / (secondPeriods + 1);
    signalExponent = 2 / (signalPeriods + 1);
    if (signalPeriods) {
        label = "tsi(" + firstPeriods + "," + secondPeriods + "," + signalPeriods + ")";
        signalLabel = label + " Signal";
    }
}

function validateField (fieldName, value) {
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

    var priceChange = CLOSE - price(1),
        absolutePriceChange = Math.abs(priceChange),
        TSI;

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

    TSI = (secondEMA / secondAbsoluteEMA) * 100;

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