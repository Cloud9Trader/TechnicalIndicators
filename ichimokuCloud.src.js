function getBufferSize (conversionLinePeriods, baseLinePeriods, leadingSpanPeriods) {
    return Math.max(conversionLinePeriods, baseLinePeriods, leadingSpanPeriods);
}

function validate (conversionLinePeriods, baseLinePeriods, leadingSpanPeriods, laggingSpanPeriods) {
    validateField("conversionLinePeriods", conversionLinePeriods);
    validateField("baseLinePeriods", baseLinePeriods);
    validateField("leadingSpanPeriods", leadingSpanPeriods);
    validateField("laggingSpanPeriods", laggingSpanPeriods);
}

function validateField (fieldName, value) {
    if (typeof value !== "number") {
        error("Ichimoku Cloud " + fieldName + " must be a number");
    }
    if (value % 1 !== 0) {
        error("Ichimoku Cloud " + fieldName + " must be an integer");
    }
    if (value <= 0) {
        error("Ichimoku Cloud " + fieldName + " must be an integer");
    }
    if (value > 100) {
        error("Ichimoku Cloud " + fieldName + " maximum value is 100");
    }
}

function onIntervalClose (conversionLinePeriods, baseLinePeriods, leadingSpanPeriods, laggingSpanPeriods) {

    var conversionLineCloses = prices(conversionLinePeriods),
        baseLineCloses = prices(baseLinePeriods),
        leadingSpanBCloses = prices(leadingSpanPeriods),
        conversionLine,
        baseLine,
        spanALine,
        spanBLine,
        greenCloud,
        redCloud;
        
    conversionLine = (Math.highest(conversionLineCloses) + Math.lowest(conversionLineCloses)) / 2;
    baseLine = (Math.highest(baseLineCloses) + Math.lowest(baseLineCloses)) / 2;
    spanALine = (conversionLine + baseLine) / 2;
    spanBLine = (Math.highest(leadingSpanBCloses) + Math.lowest(leadingSpanBCloses)) / 2;
   
    if (spanALine > spanBLine) {
        greenCloud = [spanALine, spanBLine];
        redCloud = [spanBLine, spanBLine];
    } else {
        greenCloud = [spanALine, spanALine];
        redCloud = [spanALine, spanBLine];
    }
    
    return [{
        name: "Ichimoku Tenkan-sen (Conversion Line)",
        value: conversionLine
    }, {
        name: "Ichimoku Kijun-sen (Base Line)",
        value: baseLine
    }, {
        name: "Ichimoku Senkou Span A (Leading Span A)",
        color: "#90ed7d",
        plotOffset: baseLinePeriods,
        value: spanALine
    }, {
        name: "Ichimoku Senkou Span B (Leading Span B)",
        color: "#f15c80",
        plotOffset: baseLinePeriods,
        value: spanBLine
    }, {
        name: "Ichimoku Chikou Span (Lagging Span)",
        plotOffset: -laggingSpanPeriods,
        value: CLOSE
    }, {
        color: "#90ed7d",
        lineWidth: 0,
        plotOffset: baseLinePeriods,
        value: greenCloud,
        tooltip: {
            headerFormat: "",
            pointFormat: ""
        }
    }, {
        color: "#f15c80",
        lineWidth: 0,
        plotOffset: baseLinePeriods,
        value: redCloud,
        tooltip: {
            headerFormat: "",
            pointFormat: ""
        }
    }];
}