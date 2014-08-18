var moneyFlows = [];

function getStudyAxisConfig () {
    return {
        gridLineWidth: 0,
        plotLines: [
            {value: 20, color: "#EEE", width: 1},
            {value: 80, color: "#EEE", width: 1}
        ]
    };
}

function getRunUpCount (periods) {
    return periods;
}

function getBufferSize (periods) {
    return 0;
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("Money Flow Index periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Money Flow Index periods must be an integer");
    }
    if (periods > 100) {
        error("Money Flow Index maximum periods is 100");
    }
    if (periods <= 0) {
        error("Money Flow Index periods must be greater than zero");
    }
}

function onIntervalClose (periods) {
    var typicalPrice = (HIGH + LOW + CLOSE) / 3,
        moneyFlow = typicalPrice * VOLUME * (CLOSE > OPEN ? 1 : -1),
        positiveMoneyFlow = 0,
        negativeMoneyFlow = 0,
        moneyFlowRatio;

    moneyFlows.push(moneyFlow);

    if (moneyFlows.length < periods) {
        return null;
    } else if (moneyFlows.length > periods) {
        moneyFlows.shift();
    }

    moneyFlows.forEach(function (moneyFlow) {
        if (moneyFlow > 0) {
            positiveMoneyFlow += moneyFlow;
        } else {
            negativeMoneyFlow -= moneyFlow;
        }
    });

    moneyFlowRatio = positiveMoneyFlow / negativeMoneyFlow;

    return {
        overlay: false,
        value: 100 - (100 / (1 + moneyFlowRatio)),
        precision: 2
    };
}