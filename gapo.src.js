var highs = [],
    lows = [];

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Gopalakrishnan Range Index periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Gopalakrishnan Range Index periods must be an integer");
    }
    if (periods > 100) {
        error("Gopalakrishnan Range Index maximum periods is 100");
    }
    if (periods <= 0) {
        error("Gopalakrishnan Range Index periods must be greater than 0");
    }
}

function onIntervalClose (periods) {

    highs.push(HIGH);
    lows.push(LOW);

    if (highs.length < periods) {
        return null;
    } else if (highs.length > periods) {
        highs.shift();
        lows.shift();
    }

    return {
        overlay: false,
        value: Math.log(Math.max.apply(null, highs) - Math.min.apply(null, lows)) / Math.log(periods)
    };
}