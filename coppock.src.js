var firstRoCs = [];

function getRunUpCount (firstRoCPeriods, wmaPeriods, secondRoCPeriods) {
    return wmaPeriods;
}

function getBufferSize (firstRoCPeriods, wmaPeriods, secondRoCPeriods) {
    return Math.max(firstRoCPeriods, secondRoCPeriods) + 1;
}

function validate (firstRoCPeriods, wmaPeriods, secondRoCPeriods) {
    validateField("firstRoCPeriods", firstRoCPeriods);
    validateField("wmaPeriods", wmaPeriods);
    validateField("secondRoCPeriods", secondRoCPeriods);
}

function validateField (fieldName, value) {
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

    firstRoCClose = price(firstRoCPeriods);

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

    secondRoCClose = price(secondRoCPeriods);
    secondRoC = ((CLOSE - secondRoCClose) / secondRoCClose) * 100;

    return {
        overlay: false,
        value: (wmaNominator / ((wmaPeriods / 2) * (wmaPeriods + 1))) + secondRoC
    };
}