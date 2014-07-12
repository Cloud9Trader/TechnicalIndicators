var closePeriodsCount,
    closes = [],
    firstRoCs = [];

function getRunUpCount (firstRoCPeriods, wmaPeriods, secondRoCPeriods) {
    closePeriodsCount = Math.max(firstRoCPeriods, secondRoCPeriods);
    return closePeriodsCount + wmaPeriods;
}

function onStart (firstRoCPeriods, wmaPeriods, secondRoCPeriods) {
    validate("firstRoCPeriods", firstRoCPeriods);
    validate("wmaPeriods", wmaPeriods);
    validate("secondRoCPeriods", secondRoCPeriods);
}

function validate (fieldName, value) {
    if (typeof value !== "number") {
        error("Coppock Curve " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("Coppock Curve " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("Coppock Curve " + fieldName + " maximum is 100");
    }
    if (value <= 0) {
        error("Coppock Curve " + fieldName + " must be greater than 0");
    }
}

function onIntervalClose (firstRoCPeriods, wmaPeriods, secondRoCPeriods) {

    var firstRoCClose,
        firstRoC,
        secondRoCClose,
        secondRoC,
        wmaNominator = 0;

    closes.push(CLOSE);

    if (closes.length < closePeriodsCount) {
        return null;
    } else if (closes.length > closePeriodsCount * 3) {
        closes = closes.slice(closes.length - closePeriodsCount);
    }

    firstRoCClose = closes[closes.length - firstRoCPeriods];
    firstRoC = ((CLOSE - firstRoCClose) / firstRoCClose) * 100;

    firstRoCs.push(firstRoC);

    if (firstRoCs.length < wmaPeriods) {
        return null;
    } else if (firstRoCs.length > wmaPeriods) {
        firstRoCs.shift();
    }

    firstRoCs.forEach(function (roc, index) {
        wmaNominator += roc * (index + 1);
    });

    secondRoCClose = closes[closes.length - secondRoCPeriods];
    secondRoC = ((CLOSE - secondRoCClose) / secondRoCClose) * 100;

    return {
        overlay: false,
        value: (wmaNominator / ((wmaPeriods / 2) * (wmaPeriods + 1))) + secondRoC
    };
}