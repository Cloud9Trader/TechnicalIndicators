var closes = [],
    runUp;

function getRunUpCount(conversionLinePeriods, baseLinePeriods, leadingSpanPeriods) {
    runUp = Math.max(conversionLinePeriods, baseLinePeriods, leadingSpanPeriods);
    return runUp;
}

function onStart (conversionLinePeriods, baseLinePeriods, leadingSpanPeriods, laggingSpanPeriods) {
    validate("conversionLinePeriods", conversionLinePeriods);
    validate("baseLinePeriods", baseLinePeriods);
    validate("leadingSpanPeriods", leadingSpanPeriods);
    validate("laggingSpanPeriods", laggingSpanPeriods);
}

function validate (fieldName, value) {
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

    var conversionLineCloses,
        baseLineCloses,
        leadingSpanBCloses,
        conversionLine,
        baseLine,
        spanALine,
        spanBLine,
        greenCloud,
        redCloud;
    
    closes.push(CLOSE);
    
    if (closes.length < runUp) {
        return null;
    }
    
    if (closes.length > runUp) {
        closes.shift();
    }
    
    conversionLineCloses = closes.slice(closes.length - conversionLinePeriods);
    baseLineCloses = closes.slice(closes.length - baseLinePeriods);
    leadingSpanBCloses = closes.slice(closes.length - leadingSpanPeriods);
        
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