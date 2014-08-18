var displacement;

function getBufferSize (periods) {
    return periods;
}

function validate (periods) {
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
}

function onStart () {
    displacement = Math.floor((periods / 2) + 1);
}

function onIntervalClose (periods) {
    var sma = Math.average(prices(periods));
    return [{
        name: "DPO",
        value: price(displacement) - sma,
        plotOffset: -displacement,
        type: "area",
        overlay: false
    }, {
        name: "SMA",
        value: sma,
        plotOffset: -displacement
    }];
}