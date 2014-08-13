/* 
 * This is the code for the classic Simple Moving Average indicator.
 *
 * There are plenty of indicators already built in and writing your own is fairly
 * straightforward. Technical indicators can be drawn as price charts overlays or
 * beneath them as studies. They can also be used inside your algorithms by calling
 * the key specified to the right as a function, passing in any parameters,
 * e.g. SMA_Example(15)
 *
 * There's an onStart function below to validate the input parameter, but writing an
 * indicator can be as simple as declaring an onIntervalClose function that returns
 * the value of the indicator.
 *
 * Indicators can return any number of values along with chart configuration to so
 * they display exactly as you want them.
 *
 * See the documentation for more info:
 * https://www.cloud9trader.com/documentation/writing-your-technical-indicators
 *
 * We've also open sourced the code for our built in indicators on GitHub.
 * https://github.com/cloud9trader/technicalindicators
 */


var values = [];

function getRunUpCount () {

    // This tells the system how much run up price data to load prior to start date
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

    var mid = (BID + ASK) / 2;

    // Push closing mid price to the values array
    values.push(mid);

    // If we don't have enough run up yet
    if (values.length < periods) {

        // Retuning null indicates we cannot yet produce a value
        return null;

    // If we have too many values, shift out the oldest (once run up data is filled, will always be one too many)
    } else if (values.length > periods) {

        // Shift out the oldest close price
        values.shift();
    }


    // Return the mean average
    return Math.average(values);
}