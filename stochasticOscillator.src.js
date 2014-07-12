var values = [];
var oscillatorValues = [];
var label;
var maLabel;

function getRunUpCount (periods, smaPeriods) {
    return periods + smaPeriods;
}

function onStart (periods, smaPeriods) {
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
    
    var oscillatorValue,
        lowestLow;
    
    values.push(CLOSE);
    
    if (values.length < periods) {
        return null;
    } else if (values.length > periods) {
        values.shift();
    }
        
    lowestLow = Math.min.apply(null, values);

    oscillatorValue = ((CLOSE - lowestLow) / (Math.max.apply(null, values) - lowestLow)) * 100;
    oscillatorValues.push(oscillatorValue);

    if (oscillatorValues.length < smaPeriods) {
        return null;
    } else if (oscillatorValues.length > smaPeriods) {
        oscillatorValues.shift();
    }

    return [{
        overlay: false,
        name: label,
        value: oscillatorValue,
        tooltip: {
            valueDecimals: 1
        }
    }, {
        overlay: false,
        name: maLabel,
        value: Math.average(oscillatorValues),
        tooltip: {
            valueDecimals: 1
        }
    }];
}