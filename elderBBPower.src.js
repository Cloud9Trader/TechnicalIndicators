var bullLabel,
    bearLabel,
    closes = [],
    exponent,
    EMA;

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Elder Bull/Bear Power periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Elder Bull/Bear Power periods must be an integer");
    }
    if (periods > 100) {
        error("Elder Bull/Bear Power maximum periods is 100");
    }
    if (periods <= 0) {
        error("Elder Bull/Bear Power periods must be greater than 0");
    }
    exponent = 2 / (periods + 1);
    bullLabel = "Elder Bull Power (" + periods + ")";
    bearLabel = "Elder Bear Power (" + periods + ")";
}

function onIntervalClose (periods) {

    if (EMA === undefined) {
        closes.push(CLOSE);
        if (closes.length === periods) {
            EMA = Math.average(closes);
        } else {
            return null;
        }
    } else {
        EMA = ((CLOSE - EMA) * exponent) + EMA;
    }

    return [{
        label: bullLabel,
        value: HIGH - EMA,
        color: "#90ed7d",
        overlay: false,
        type: "column"
    }, {
        label: bearLabel,
        value: LOW - EMA,
        color: "#f15c80",
        overlay: false,
        type: "column"
    }];
}