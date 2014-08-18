var label,
    emaLabel;

function getRunUpCount (emaPeriods, atrPeriods, atrMultiplier) {
    return Math.max(emaPeriods, atrPeriods) * 2;
}

function getBufferSize (emaPeriods, atrPeriods, atrMultiplier) {
    return 1;
}

function validate (emaPeriods, atrPeriods, atrMultiplier) {
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
}

function onStart (emaPeriods, atrPeriods, atrMultiplier) {
    label = "Keltner Channels (" + emaPeriods + "," + atrPeriods + "," + atrMultiplier + ")";
    emaLabel = "EMA (" + emaPeriods + ")";
}

function onIntervalClose (emaPeriods, atrPeriods, atrMultiplier) {
    
    var previousClose = price(1),
        ema = ema(emaPeriods),
        atr = atr(atrPeriods);

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