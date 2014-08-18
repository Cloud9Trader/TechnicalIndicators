function validate (periods) {
    if (typeof periods !== "number") {
        error("Aroon periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Aroon periods must be an integer");
    }
    if (periods > 100) {
        error("Aroon maximum periods is 100");
    }
    if (periods <= 0) {
        error("Aroon periods must be greater than zero");
    }
}

function getBufferSize (periods) {
    return periods;
}

function getStudyAxisConfig () {
    return {
        min: 0,
        max: 100
    };
}

function onIntervalClose (periods) {

    var highestHigh,
        lowestLow,
        highIndex,
        lowIndex;

    prices(periods).forEach(function (close, index) {
        if (!highestHigh || close > highestHigh) {
            highestHigh = close;
            highIndex = periods - index - 1;
        }
        if (!lowestLow || close < lowestLow) {
            lowestLow = close;
            lowIndex = periods - index - 1;
        }
    });

    return [{
        name: "Aroon Up",
        overlay: false,
        value: (highIndex / (periods - 1)) * 100,
        type: "line",
        color: "#90ed7d",
        tooltip: {
            valueDecimals: 1,
            valueSuffix: "%"
        }
    }, {
        name: "Aroon Down",
        overlay: false,
        value: (lowIndex / (periods - 1)) * 100,
        type: "line",
        color: "#f15c80",
        tooltip: {
            valueDecimals: 1,
            valueSuffix: "%"
        }
    }];
}