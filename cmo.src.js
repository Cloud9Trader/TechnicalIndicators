var signalLabel,
    signalExponent,
    previousClose,
    changes = [],
    absoluteChanges = [],
    signal,
    cmos = [];

function getRunUpCount (periods, signalPeriods) {
    return periods + (signalPeriods || 0);
}

function getStudyAxisConfig () {
    return {
        tickPositions: [-100, -50, 0, 50, 100]
    };
}

function validate (periods, signalPeriods) {
    if (typeof periods !== "number") {
        error("Chande Momentum Oscillator periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Chande Momentum Oscillator periods must be an integer");
    }
    if (periods > 100) {
        error("Chande Momentum Oscillator maximum periods is 100");
    }
    if (periods <= 0) {
        error("Chande Momentum Oscillator periods must be greater than zero");
    }
    if (!signalPeriods) {
        return;
    }
    if (typeof signalPeriods !== "number") {
        error("Chande Momentum Oscillator signalPeriods must be a number");
    }
    if (signalPeriods % 1 !== 0) {
        error("Chande Momentum Oscillator signalPeriods must be an integer");
    }
    if (signalPeriods > 100) {
        error("Chande Momentum Oscillator maximum signalPeriods is 100");
    }
    if (signalPeriods < 0) {
        error("Chande Momentum Oscillator signalPeriods must be greater than or equal to zero");
    }   
}

function onStart (periods, signalPeriods) {
    signalLabel = "cmo(" + periods + "," + signalPeriods + ") Signal";
    signalExponent = 2 / (signalPeriods + 1);
}

function onIntervalClose (periods, signalPeriods) {

    var change,
        cmo;

    if (previousClose === undefined) {
        previousClose = CLOSE;
        return null;
    }

    change = CLOSE - previousClose;
    changes.push(change);
    absoluteChanges.push(Math.abs(change));

    if (changes.length < periods) {
        return null;
    } else if (changes.length > periods) {
        changes.shift();
        absoluteChanges.shift();
    }

    previousClose = CLOSE;
    
    cmo = 100 * (Math.average(changes) / Math.average(absoluteChanges));

    // NOTE Above calculation looks different from often published formula, though the below is identical
    // var positiveChanges = 0,
    //     negativeChanges = 0,
    //     cmo2;
    // changes.forEach(function (change) {
    //     if (change > 0) {
    //         positiveChanges += change;
    //     } else {
    //         negativeChanges -= change;
    //     }
    // });
    // cmo2 = ((positiveChanges - negativeChanges) / (positiveChanges + negativeChanges)) * 100;

    if (!signalPeriods) {
        return {
            overlay: false,
            value: cmo
        };
    }

    if (signal === undefined) {
        cmos.push(cmo);
        if (cmos.length === signalPeriods) {
            signal = Math.average(cmos);
        } else {
            return null;
        }
    } else {
        signal = ((cmo - signal) * signalExponent) + signal;
    }

    return [{
        value: cmo,
        overlay: false
    }, {
        name: signalLabel,
        value: signal,
        overlay: false
    }];
}