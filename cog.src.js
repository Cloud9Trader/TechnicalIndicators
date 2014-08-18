var signalLabel,
    signalExponent,
    closes = [],
    signal,
    cogs = [];

function getRunUpCount (periods, signalPeriods) {
    return signalPeriods || 0;
}

function getBufferSize (periods) {
    return periods;
}

function validate (periods, signalPeriods) {
    if (typeof periods !== "number") {
        error("Center of Gravity Oscillator periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Center of Gravity Oscillator periods must be an integer");
    }
    if (periods > 100) {
        error("Center of Gravity Oscillator maximum periods is 100");
    }
    if (periods <= 0) {
        error("Center of Gravity Oscillator periods must be greater than zero");
    }
    if (!signalPeriods) {
        return;
    }
    if (typeof signalPeriods !== "number") {
        error("Center of Gravity Oscillator signalPeriods must be a number");
    }
    if (signalPeriods % 1 !== 0) {
        error("Center of Gravity Oscillator signalPeriods must be an integer");
    }
    if (signalPeriods > 100) {
        error("Center of Gravity Oscillator maximum signalPeriods is 100");
    }
    if (signalPeriods < 0) {
        error("Center of Gravity Oscillator signalPeriods must be greater than or equal to zero");
    }
}

function onStart (periods, signalPeriods) {
    signalLabel = "cog(" + periods + "," + signalPeriods + ") Signal";
    signalExponent = 2 / (signalPeriods + 1);
}

function onIntervalClose (periods, signalPeriods) {

    var nominator = 0,
        denominator = 0,
        cog;

    // NOTE Some sources suggest (HIGH + LOW) / 2 rather than CLOSE price.
    prices(periods).forEach(function (close, index) {
        nominator += close * (periods - index + 1);
        denominator += close;
    });

    if (denominator === 0) {
        return null;
    }

    cog = -nominator / denominator;

    if (!signalPeriods) {
        return [{
            overlay: false,
            value: cog
        }];
    }

    if (signal === undefined) {
        cogs.push(cog);
        if (cogs.length === signalPeriods) {
            signal = Math.average(cogs);
        } else {
            return null;
        }
    } else {
        signal = ((cog - signal) * signalExponent) + signal;
    }

    return [{
        overlay: false,
        value: cog
    }, {
        name: signalLabel,
        value: signal,
        overlay: false,
    }];
}