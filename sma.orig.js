var values = [];
var length = null;
var cacheSum = null;

module.exports = {

    getRunUpCount: function (PARAMETER) {
        return PARAMETER;
    },

    // BID and ASK are close prices
    onIntervalClose: function (PARAMETER, BID, ASK) {
        var mid = (BID + ASK) / 2,
            sum = 0;

        // Push closing mid price to end of values array
        values.push(mid);

        // Store length (slightly faster than accessing repeatedly)
        length = values.length;

        // We haven't got enough run up data to produce a value, so return null
        if (length < PARAMETER) {
            return null;
        }

        // Re-indexing array is slow, so rather than splicing dropped value from the beginning each time we just splice out old data every so often
        if (length > PARAMETER * 10) {
            values.splice(0, length - PARAMETER);
            length = values.length;
        }

        // Clear the onTick cacheSum optimisation
        cacheSum = null;

        // Sum the last n period values
        for (var i = length - PARAMETER; i < length; i++) {
            sum += values[i];
        }

        // Return the mean average
        return sum / PARAMETER;
    },

    onTick: function (PARAMETER, BID, ASK) {
        var mid = (BID + ASK) / 2,
            sum = 0;

        if (cacheSum === null) {

            // Sum the last n period - 1 values
            for (var i = length - PARAMETER + 1; i < length; i++) {
                sum += values[i];
            }

            // Cache the summed value to save us iterating every tick
            cacheSum = sum;

        } else {

            // Use the cached value
            sum = cacheSum;
        }

        // Add the current value
        sum += mid;

        // Return the mean average
        return sum / PARAMETER;
    }
};