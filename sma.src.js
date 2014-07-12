var values = [];
var length = null;
var cacheSum = null;

function getRunUpCount () {
    return periods;
}

function onStart (periods) {

    // Check that the period passed is a number
    if (typeof periods !== "number") {
        error("SMA periods must be a number");
    }

    // ...and an integer
    if (periods % 1 !== 0) {
        error("SMA periods must be an integer");
    }

    // ...and 100 or less
    if (periods > 100) {
        error("SMA maximum periods is 100");
    }

    // ...and not zero or negative
    if (periods <= 0) {
        error("SMA periods must be greater than zero");
    }
}

// BID and ASK are close prices
function onIntervalClose (periods) {

    // Push closing mid price to end of values array
    values.push(CLOSE);

    // Store length (slightly faster than accessing repeatedly)
    length = values.length;

    // We haven't got enough run up data to produce a value, so return null
    if (length < periods) {
        return null;
    }

    // Re-indexing array is slow, so rather than splicing dropped value from the beginning each time we just splice out old data every so often
    if (length > periods * 10) {
        values.splice(0, length - periods);
        length = values.length;
    }

    // Clear the onTick cacheSum optimization
    cacheSum = null;

    // Return the mean average
    return Math.average(values.slice(values.length - periods));
}