var values = [];
var cacheSum = null;
var smaLabel;

function getRunUpCount (periods) {
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
    smaLabel = "sma(" + periods + ")";
}


function onIntervalClose (periods, envelope) {
    var mid = (BID + ASK) / 2,
        sma;

    // Push closing mid price to end of values array
    values.push(mid);

    // We haven't got enough run up data to produce a value, so return null
    if (values.length < periods) {
        return null;
    }

    // Re-indexing array is slow, so rather than splicing dropped value from the beginning each time we just splice out old data every so often
    if (values.length > periods * 10) {
        values.splice(0, values.length - periods);
    }
    
    sma = Math.average(values.slice(values.length - periods, values.length));
    envelope = sma * (envelope / 100);
    
    return [
        [sma - envelope, sma + envelope],
        {name: smaLabel, dashStyle: "Dash", value: sma}
    ];
}