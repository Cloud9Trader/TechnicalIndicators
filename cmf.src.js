var moneyFlowMultipliers = [];
var moneyFlowVolumes = [];

function getRunUpCount () {
    return 0;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Chaikin Money Flow periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Chaikin Money Flow periods must be an integer");
    }
    if (periods > 100) {
        error("Chaikin Money Flow maximum periods is 100");
    }
    if (periods <= 0) {
        error("Chaikin Money Flow periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    var moneyFlowMulitplier = ((CLOSE - LOW) - (HIGH - CLOSE)) / (HIGH - LOW),
        moneyFlowVolume = moneyFlowMulitplier * VOLUME;

    moneyFlowMultipliers.push(moneyFlowMulitplier);
    moneyFlowVolumes.push(moneyFlowVolume);

    if (moneyFlowMultipliers.length < periods) {
        return null;
    } else if (moneyFlowMultipliers.length > periods) {
        moneyFlowMultipliers.shift();
        moneyFlowVolumes.shift();
    }

    return {
        overlay: false,
        value: Math.sum(moneyFlowMultipliers) / Math.sum(moneyFlowVolumes),
        type: "areaspline"
    };
}