var exponent,
    signalExponent,
    label,
    signalLabel,
    closes = [],
    singleEMA,
    singleEMAs = [],
    doubleEMA,
    doubleEMAs = [],
    tripleEMA,
    previousTripleEMA,
    TRIXs = [],
    signal;

function onStart (periods, signalPeriods) {
    if (typeof periods !== "number") {
        error("TRIX periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("TRIX periods must be an integer");
    }
    if (periods > 100) {
        error("TRIX maximum periods is 100");
    }
    if (periods <= 0) {
        error("TRIX periods must be greater than 0");
    }

    exponent = 2 / (periods + 1);

    if (signalPeriods) {
        if (typeof signalPeriods !== "number") {
            error("TRIX signalPeriods must be a number");
        }
        if (signalPeriods % 1 !== 0) {
            error("TRIX signalPeriods must be an integer");
        }
        if (signalPeriods > 100) {
            error("TRIX maximum signalPeriods is 100");
        }
        if (signalPeriods < 0) {
            error("TRIX periods must be greater than or equal to 0");
        }

        signalExponent = 2 / (signalPeriods + 1);
        label = "trix(" + periods + "," + signalPeriods + ")";
        signalLabel = label + " Signal";
    }
}

function onIntervalClose (periods, signalPeriods) {

    var TRIX;
    
    if (singleEMA === undefined) {
        closes.push(CLOSE);
        if (closes.length === periods) {
            singleEMA = Math.average(closes);
        } else {
            return null;
        }
    } else {
        singleEMA = ((CLOSE - singleEMA) * exponent) + singleEMA;
    }

    if (doubleEMA === undefined) {
        singleEMAs.push(singleEMA);
        if (singleEMAs.length === periods) {
            doubleEMA = Math.average(singleEMAs);
        } else {
            return null;
        }
    } else {
        doubleEMA = ((singleEMA - doubleEMA) * exponent) + doubleEMA;
    }

    if (tripleEMA === undefined) {
        doubleEMAs.push(doubleEMA);
        if (doubleEMAs.length === periods) {
            tripleEMA = Math.average(doubleEMAs);
        } else {
            return null;
        }
    } else {
        tripleEMA = ((doubleEMA - tripleEMA) * exponent) + tripleEMA;
    }

    if (previousTripleEMA === undefined) {
        previousTripleEMA = tripleEMA;
        return null;
    }

    TRIX = ((tripleEMA - previousTripleEMA) / previousTripleEMA) * 100;

    if (!signalPeriods) {
        return {
            value: TRIX,
            overlay: false
        };
    }

    previousTripleEMA = tripleEMA;

    if (signal === undefined) {
        TRIXs.push(TRIX);
        if (TRIXs.length === signalPeriods) {
            signal = Math.average(TRIXs);
        } else {
            return null;
        }
    } else {
        signal = ((TRIX - signal) * signalExponent) + signal;
    }

    return [{
        name: label,
        value: TRIX,
        overlay: false
    }, {
        name: signalLabel,
        value: signal,
        overlay: false
    }];
}