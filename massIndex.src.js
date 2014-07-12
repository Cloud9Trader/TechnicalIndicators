var emaExponent,
    differentials = [],
    singleEMA,
    singleEMAs = [],
    doubleEMA,
    emaRatios = [];

function getRunUpCount (emaPeriods, summationPeriods) {
    return (emaPeriods * 2) + summationPeriods;
}

function onStart (emaPeriods, summationPeriods) {
    validate("emaPeriods", emaPeriods);
    validate("summationPeriods", summationPeriods);
    emaExponent = 2 / (emaPeriods + 1);
}

function validate (fieldName, value) {
    if (typeof value !== "number") {
        error("Mass Index " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("Mass Index " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("Mass Index " + fieldName + " maximum is 100");
    }
    if (value <= 0) {
        error("Mass Index " + fieldName + " must be greater than zero");
    }
}

function onIntervalClose (emaPeriods, summationPeriods) {
    
    var differential = HIGH - LOW,
        emaRatio;

    if (singleEMA === undefined) {
        differentials.push(differential);
        if (differentials.length === emaPeriods) {
            singleEMA = Math.average(differentials);
        } else {
            return null;
        }
    } else {
        singleEMA = ((differential - singleEMA) * emaExponent) + singleEMA;
    }

    if (doubleEMA === undefined) {
        singleEMAs.push(singleEMA);
        if (singleEMAs.length === emaPeriods) {
            doubleEMA = Math.average(singleEMAs);
        } else {
            return null;
        }
    } else {
        doubleEMA = ((singleEMA - doubleEMA) * emaExponent) + doubleEMA;
    }

    emaRatio = singleEMA / doubleEMA;

    emaRatios.push(emaRatio);

    if (emaRatios.length < summationPeriods) {
        return null;
    } else if (emaRatios.length > summationPeriods) {
        emaRatios.shift();
    }

    return {
        value: Math.sum(emaRatios),// / doubleEMA,
        overlay: false,
        precision: 1
    };
}