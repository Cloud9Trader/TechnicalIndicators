var closes = [];

function getRunUpCount (periods) {
    return periods;
}

function getStudyAxisConfig () {
    return {
        min: 0,
        max: 100
    };
}

function onStart (periods) {
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

function onIntervalClose (periods) {

    var highestHigh,
        lowestLow,
        highIndex,
        lowIndex;

    closes.push(CLOSE);

    if (closes.length < periods) {
        return null;
    } else if (closes.length > periods) {
        closes.shift();
    }

    closes.forEach(function (closePrice, index) {
        if (!highestHigh || closePrice > highestHigh) {
            highestHigh = closePrice;
            highIndex = index;
        }
        if (!lowestLow || closePrice < lowestLow) {
            lowestLow = closePrice;
            lowIndex = index;
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