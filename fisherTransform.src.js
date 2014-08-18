var smoothingExponent,
    fisherExponent,
    label,
    signalLabel,
    midpoints = [],
    raws = [],
    smoothed,
    logarithm,
    logarithms = [],
    fisher,
    lastFisher;

// TODO Could parameterize smoothing periods
var smoothingPeriods = 5;
var fisherPeriods = 3;

function validate (periods) {
    if (typeof periods !== "number") {
        error("Fisher Transform periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Fisher Transform periods must be an integer");
    }
    if (periods > 100) {
        error("Fisher Transform maximum periods is 100");
    }
    if (periods <= 0) {
        error("Fisher Transform periods must be greater than 0");
    }
}

function getRunUpCount (periods) {
    return periods + smoothingPeriods + fisherPeriods + 1;
}

function getBufferSize () {
    return 0;
}

function onStart (periods) {
    smoothingExponent = 2 / (smoothingPeriods + 1);
    fisherExponent = 2 / (fisherPeriods + 1);
    label = "Fisher Transform (" + periods + ")";
    signalLabel = label + " Signal";
}

function onIntervalClose (periods) {

    var midpoint = (HIGH + LOW) / 2,
        periodLow,
        raw,
        output;

    midpoints.push(midpoint);

    if (midpoints.length < periods) {
        return null;
    } else if (midpoints.length > periods) {
        midpoints.shift();
    }

    periodLow = Math.min.apply(null, midpoints);

    raw = 2 * ((midpoint - periodLow) / (Math.max.apply(null, midpoints) - periodLow)) - 1;

    if (smoothed === undefined) {
        raws.push(raw);
        if (raws.length === smoothingPeriods) {
            smoothed = Math.average(raws);
        } else {
            return null;
        }
    } else {
        smoothed = ((raw - smoothed) * smoothingExponent) + smoothed;
    }

    logarithm = Math.log((1 + smoothed) / (1 - smoothed));

    if (fisher === undefined) {
        logarithms.push(logarithm);
        if (logarithms.length === fisherPeriods) {
            fisher = Math.average(logarithms);
        } else {
            return null;
        }
    } else {
        fisher = ((logarithm - fisher) * fisherExponent) + fisher;
    }

    if (lastFisher === undefined) {
        lastFisher = fisher;
        return null;
    }

    output = [{
        name: label,
        overlay: false,
        value: fisher,
        precision: 3
    }, {
        name: signalLabel,
        overlay: false,
        value: lastFisher,
        precision: 3
    }];

    lastFisher = fisher;

    return output;
}