var maxROCPeriods,
    maxSMAPeriods,
    closes = [],
    firstROCs = [],
    secondROCs = [],
    thirdROCs = [],
    fourthROCs = [],
    KSTs = [];

function getRunUpCount (firstROCPeriods, secondROCPeriods, thirdROCPeriods, fourthROCPeriods, firstSMAPeriods, secondSMAPeriods, thirdSMAPeriods, fourthSMAPeriods, signalSMA) {

    maxROCPeriods = Math.max(firstROCPeriods, secondROCPeriods, thirdROCPeriods, fourthROCPeriods);
    maxSMAPeriods = Math.max(firstSMAPeriods, secondSMAPeriods, thirdSMAPeriods, fourthSMAPeriods);

    return maxROCPeriods + maxSMAPeriods + (signalSMA || 0);
}

function onStart (firstROCPeriods, secondROCPeriods, thirdROCPeriods, fourthROCPeriods, firstSMAPeriods, secondSMAPeriods, thirdSMAPeriods, fourthSMAPeriods, signalSMA) {
    validate("firstROCPeriods", firstROCPeriods);
    validate("secondROCPeriods", secondROCPeriods);
    validate("thirdROCPeriods", thirdROCPeriods);
    validate("fourthROCPeriods", fourthROCPeriods);
    validate("firstROCPeriods", firstROCPeriods);
    validate("secondROCPeriods", secondROCPeriods);
    validate("thirdROCPeriods", thirdROCPeriods);
    validate("fourthROCPeriods", fourthROCPeriods);

    if (firstROCPeriods >= secondROCPeriods) {
        error("Know Sure Thing secondROCPeriods must be greater than firstROCPeriods");
    }
    if (secondROCPeriods >= thirdROCPeriods) {
        error("Know Sure Thing thirdROCPeriods must be greater than secondROCPeriods");
    }
    if (thirdROCPeriods >= fourthROCPeriods) {
        error("Know Sure Thing fourthROCPeriods must be greater than thirdROCPeriods");
    }
    if (!signalSMA) {
        return;
    }
    if (typeof signalSMA !== "number") {
        error("Know Sure Thing signalSMA must be a number");
    }
    if (signalSMA % 1 !== 0) {
        error("Know Sure Thing signalSMA must be an integer");
    }
    if (signalSMA < 0) {
        error("Know Sure Thing signalSMA must be greater than or equal to zero");
    }
}

function validate (fieldName, value) {
    if (typeof value !== "number") {
        error("Know Sure Thing " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("Know Sure Thing " + fieldName + " must be an integer");
    }
    if (value <= 0) {
        error("Know Sure Thing " + fieldName + " must be an greater than zero");
    }
    if (value > 100) {
        error("Know Sure Thing " + fieldName + " maximum value is 100");
    }
}

function onIntervalClose (firstROCPeriods, secondROCPeriods, thirdROCPeriods, fourthROCPeriods, firstSMAPeriods, secondSMAPeriods, thirdSMAPeriods, fourthSMAPeriods, signalSMA) {

    var length = closes.length,
        firstPeriodClose,
        secondPeriodClose,
        thirdPeriodClose,
        fourthPeriodClose,
        RCMA1,
        RCMA2,
        RCMA3,
        RCMA4,
        KST;

    closes.push(CLOSE);

    if (length < maxROCPeriods) {
        return null;
    }

    firstPeriodClose = closes[length - firstROCPeriods];
    firstROCs.push(((CLOSE - firstPeriodClose) / firstPeriodClose) * 100);
    if (firstROCs.length > firstSMAPeriods) {
        firstROCs.shift();
    }
    if (firstROCs.length === firstSMAPeriods) {
        RCMA1 = Math.average(firstROCs);
    }

    secondPeriodClose = closes[length - secondROCPeriods];
    secondROCs.push(((CLOSE - secondPeriodClose) / secondPeriodClose) * 100);
    if (secondROCs.length > secondSMAPeriods) {
        secondROCs.shift();
    }
    if (secondROCs.length === secondSMAPeriods) {
        RCMA2 = Math.average(secondROCs);
    }

    thirdPeriodClose = closes[length - thirdROCPeriods];
    thirdROCs.push(((CLOSE - thirdPeriodClose) / thirdPeriodClose) * 100);
    if (thirdROCs.length > thirdSMAPeriods) {
        thirdROCs.shift();
    }
    if (thirdROCs.length === thirdSMAPeriods) {
        RCMA3 = Math.average(thirdROCs);
    }

    fourthPeriodClose = closes[length - fourthROCPeriods];
    fourthROCs.push(((CLOSE - fourthPeriodClose) / fourthPeriodClose) * 100);
    if (fourthROCs.length > fourthSMAPeriods) {
        fourthROCs.shift();
    }
    if (fourthROCs.length === fourthSMAPeriods) {
        RCMA4 = Math.average(fourthROCs);
    }

    // Splice occasionally
    if (length > maxROCPeriods * 3) {
        closes.splice(0, length - maxROCPeriods);
    }

    if (RCMA1 === undefined || RCMA2 === undefined || RCMA3 === undefined || RCMA4 === undefined) {
        return null;
    }

    KST = (RCMA1 * 1) + (RCMA2 * 2) + (RCMA3 * 3) + (RCMA4 * 4);

    if (!signalSMA) {
        return {
            name: "KST",
            value: KST,
            overlay: false,
            precision: 2
        };
    }

    KSTs.push(KST);

    if (KSTs.length < signalSMA) {
        return null;
    } else if (KSTs.length > signalSMA) {
        KSTs.shift();
    }

    return [{
        name: "KST",
        value: KST,
        overlay: false,
        precision: 2
    }, {
        name: "KST Signal Line",
        value: Math.average(KSTs),
        overlay: false,
        precision: 2
    }];
}