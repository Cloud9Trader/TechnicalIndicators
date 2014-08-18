var smaLabel;

function getBufferSize (periods) {
    return periods;
}

function onStart (periods, envelope) {
    if (typeof periods !== "number") {
        error("SMA Envelope periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("SMA Envelope periods must be an integer");
    }
    if (periods > 100) {
        error("SMA Envelope maximum period is 100");
    }
    if (periods <= 0) {
        error("SMA Envelope periods must be greater than 0");
    }
    if (typeof envelope !== "number") {
        error("SMA Envelope envelope must be a number");
    }
    if (envelope <= 0) {
        error("SMA Envelope envelope percent must be greater than zero");
    }
    if (envelope > 100) {
        error("SMA Envelope envelope percent must be below 100");
    }
}

function onStart (periods, envelope) {
    smaLabel = "sma(" + periods + ")";
}

function onIntervalClose (periods, envelope) {
    
    var sma = Math.average(prices(periods)),
        envelope = sma * (envelope / 100);
    
    return [
        [sma - envelope, sma + envelope],
        {name: smaLabel, dashStyle: "Dash", value: sma}
    ];
}