var values = [];
var value;
var exponent;

function onStart (periods, envelope) {
    if (typeof periods !== "number") {
        error("EMA periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("EMA periods must be an integer");
    }
    if (periods > 100) {
        error("EMA maximum periods is 100");
    }
    if (periods <= 0) {
        error("EMA periods must be greater than 0");
    }
    if (envelope <= 0) {
        error("SMA Envelope envelope percent must be greater than zero");
    }
    if (envelope > 100) {
        error("SMA Envelope envelope percent must be below 100");
    }

    exponent = exponent || 2 / (periods + 1);
}

function onIntervalClose (periods, envelope) {
    
    var mid = (BID + ASK) / 2,
        ema;

    if (values === null) {

        value = (mid * exponent) + (value * (1 - exponent));
        envelope = value * (envelope / 100);
  
        return [value, [value - envelope, value + envelope]];
        
    } else if (values.length === periods) {

        // First value is SMA (ensure there is plenty of run up data left before start)
        ema = Math.average(values);

        values = null;
        value = ema;

        envelope = ema * (envelope / 100);
  
        return [[ema - envelope, ema + envelope], ema];

    } else {

        // Push closing mid price to end of values array
        values.push(mid);
        
        return null;
    }
}