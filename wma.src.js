var closes = [];

function getRunUpCount (periods) {
    return periods;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("WMA periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("WMA periods must be an integer");
    }
    if (periods > 100) {
        error("WMA maximum periods is 100");
    }
    if (periods <= 0) {
        error("WMA periods must be greater than 0");
    }
}

function onIntervalClose (periods) {

    var nominator = 0;

    closes.push(CLOSE);

    if (closes.length < periods) {
        return null;
    } else if (closes.length > periods) {
        closes.shift();
    }

    closes.forEach(function (value, index) {
        nominator += value * (index + 1);
    });

    // Divide by triangular number of periods
    return nominator / ((periods / 2) * (periods + 1));
}