var values = [],
    label,
    maLabel;

function getRunUpCount (periods, smaPeriods) {
    return smaPeriods;
}

function getBufferSize (periods, smaPeriods) {
    return periods;
}

function validate (periods, smaPeriods) {
    if (typeof periods !== "number") {
        error("Stochastic Oscillator periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Stochastic Oscillator periods must be an integer");
    }
    if (periods > 100) {
        error("Stochastic Oscillator maximum period is 100");
    }
    if (periods <= 0) {
        error("Stochastic Oscillator periods must be greater than 0");
    }
    if (typeof smaPeriods !== "number") {
        error("Stochastic Oscillator smaPeriods must be a number");
    }
    if (smaPeriods % 1 !== 0) {
        error("Stochastic Oscillator smaPeriods must be an integer");
    }
    if (smaPeriods > 100) {
        error("Stochastic Oscillator maximum period is 100");
    }
    if (smaPeriods <= 0) {
        error("Stochastic Oscillator smaPeriods must be greater than 0");
    }
}

function onStart (periods, smaPeriods) {
    label = "Stochastic Oscillator (" + periods + ")";
    maLabel = "Stochastic Oscillator (" + periods + ") " + smaPeriods + "-Period Moving Average";
}

function getStudyAxisConfig () {
    return {
        min: 0,
        max: 100,
        tickPositions: [0, 20, 80, 100]
    };
}

function onIntervalClose (periods, smaPeriods) {
    
    var closes = prices(periods),
        periodLow = Math.min.apply(null, closes),
        periodHigh = Math.max.apply(null, closes),
        value = ((CLOSE - periodLow) / (periodHigh - periodLow)) * 100;
 
    values.push(value);

    if (values.length < smaPeriods) {
        return null;
    } else if (values.length > smaPeriods) {
        values.shift();
    }

    return [{
        overlay: false,
        name: label,
        value: value,
        tooltip: {
            valueDecimals: 1
        }
    }, {
        overlay: false,
        name: maLabel,
        value: Math.average(values),
        tooltip: {
            valueDecimals: 1
        }
    }];
}