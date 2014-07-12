var values = [];
var smaValues = [];
var displacement;

function getRunUpCount (periods) {
    return periods;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("DPO periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("DPO periods must be an integer");
    }
    if (periods > 100) {
        error("DPO maximum periods is 100");
    }
    if (periods <= 0) {
        error("DPO periods must be greater than zero");
    }
    displacement = Math.floor((periods / 2) + 1);
}

function onIntervalClose (periods) {

    var sma;

    values.push(CLOSE);

    if (values.length < periods) {
        return null;
    } else if (values.length > periods) {
        values.shift();
    }

    sma = Math.average(values);

    return [{
        name: "DPO",
        value: values[values.length - displacement] - sma,
        plotOffset: -displacement,
        type: "area",
        overlay: false
    }, {
        name: "SMA",
        value: sma,
        plotOffset: -displacement
    }];
}