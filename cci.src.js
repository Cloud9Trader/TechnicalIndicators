var typicalPrices = [];

function getStudyAxisConfig () {
    return {
        gridLineWidth: 0,
        plotLines: [
            {value: 100, color: "#EEE", width: 1},
            {value: 0, color: "#EEE", width: 1, dashStyle: "Dash"},
            {value: -100, color: "#EEE", width: 1}
        ]
    };
}

function onStart (periods, constant) {
    if (typeof periods !== "number") {
        error("CCI periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("CCI periods must be an integer");
    }
    if (periods > 100) {
        error("CCI maximum periods is 100");
    }
    if (periods <= 0) {
        error("CCI periods must be greater than 0");
    }
    if (typeof constant !== "number") {
        error("CCI constant must be a number");
    }
    if (constant <= 0) {
        error("CCI constant must be greater than 0");
    }
}

function onIntervalClose (periods, constant) {

    var typicalPrice = (HIGH + LOW + CLOSE) / 3,
        typicalPriceSMA,
        meanDeviation;
    
    typicalPrices.push(typicalPrice);
    
    if (typicalPrices.length < periods) {
        return null;
    } else if (typicalPrices.length > periods) {
        typicalPrices.shift();
    }
    
    typicalPriceSMA = Math.average(typicalPrices);
    meanDeviation = Math.meanDeviation(typicalPrices);

    return {
        overlay: false,
        value: (typicalPrice - typicalPriceSMA) / (constant * meanDeviation),
        precision: 1
    };
}