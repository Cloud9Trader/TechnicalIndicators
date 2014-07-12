var values = [],
    emaExponent,
    lastEMA,
    previousClose,
    trueRangeValues = [],
    previousAverageTrueRange,
    label,
    emaLabel;

function onStart (emaPeriods, atrPeriods, atrMultiplier) {
    if (typeof emaPeriods !== "number") {
        error("Keltner Channels EMA periods must be a number");
    }
    if (emaPeriods % 1 !== 0) {
        error("Keltner Channels EMA periods must be an integer");
    }
    if (emaPeriods > 100) {
        error("Keltner Channels EMA maximum periods is 100");
    }
    if (emaPeriods <= 0) {
        error("Keltner Channels EMA periods must be greater than 0");
    }
    if (typeof atrPeriods !== "number") {
        error("Keltner Channels Average True Range periods must be a number");
    }
    if (atrPeriods % 1 !== 0) {
        error("Keltner Channels Average True Range periods must be an integer");
    }
    if (atrPeriods > 100) {
        error("Keltner Channels Average True Range maximum periods is 100");
    }
    if (atrPeriods <= 0) {
        error("Keltner Channels Average True Range periods must be greater than zero");
    }
    if (typeof atrMultiplier !== "number") {
        error("Keltner Channels Average True Range multiplier must be a number");
    }
    if (atrMultiplier <= 0) {
        error("Keltner Channels Average True Range multiplier must be greater than zero");
    }
    emaExponent = 2 / (emaPeriods + 1);
    label = "Keltner Channels (" + emaPeriods + "," + atrPeriods + "," + atrMultiplier + ")";
    emaLabel = "EMA (" + emaPeriods + ")";
}

function onIntervalClose (emaPeriods, atrPeriods, atrMultiplier) {
    
    var trueRange,
        ema,
        atr;
    
    if (!previousClose) {
        previousClose = CLOSE;
        return null;
    }
    
    trueRange = Math.max.apply(null, [
        HIGH - LOW,
        HIGH - previousClose,
        LOW - previousClose
    ]);
    
    previousClose = CLOSE;

    if (lastEMA !== undefined) {

        ema = ((CLOSE - lastEMA) * emaExponent) + lastEMA;
        lastEMA = ema;
        
    } else if (values.length === emaPeriods) {

        // First value is SMA (ensure there is plenty of run up data left before start)
        lastEMA = Math.average(values);
        
        ema = lastEMA;

    } else {

        // Push closing mid price to end of values array
        values.push(CLOSE);
        
        ema = null;
    }
    
    if (trueRangeValues.length < atrPeriods) {
        trueRangeValues.push(trueRange);
        
        if (trueRangeValues.length < atrPeriods) {
            atr = null;
        } else {
            previousAverageTrueRange = Math.average(trueRangeValues);
            atr = previousAverageTrueRange;
        }
    } else {
        previousAverageTrueRange = ((previousAverageTrueRange * (atrPeriods - 1)) + trueRange) / atrPeriods;
        atr = previousAverageTrueRange;
    }

    if (ema !== null && atr !== null) {
        return [{
            name: label,
            value: [ema - (atr * atrMultiplier), ema + (atr * atrMultiplier)],
            color: "#7cb5ec"
        }, {
            name: emaLabel,
            value: ema,
            color: "#7cb5ec",
            dashStyle: "Dash"
        }];
    } else {
        return null;
    }
}