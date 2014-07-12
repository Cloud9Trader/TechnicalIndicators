var previousClose,
    trueRangeValues = [],
    averageTrueRange;

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Average True Range periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Average True Range periods must be an integer");
    }
    if (periods > 100) {
        error("Average True Range maximum periods is 100");
    }
    if (periods <= 0) {
        error("Average True Range periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    var trueRange;

    if (!previousClose) {
        previousClose = CLOSE;
        return null;
    }
    
    trueRange = Math.max.apply(null, [
        HIGH - LOW,
        Math.abs(HIGH - previousClose),
        Math.abs(LOW - previousClose)
    ]);

    previousClose = CLOSE;

    if (trueRangeValues.length < periods) {
        trueRangeValues.push(trueRange);
        
        if (trueRangeValues.length < periods) {
            return null;
        } else {
            averageTrueRange = Math.average(trueRangeValues);
            return {
                overlay: false,
                value: averageTrueRange
            };
        }
    } else {
        // NOTE
        // This smoothing formula is given here: http://stockcharts.com/school/doku.php?id=chart_school:technical_indicators:average_true_range_a
        // and http://en.wikipedia.org/wiki/Average_true_range
        // though some sources e.g. http://user42.tuxfamily.org/chart/manual/Average-True-Range.html#Average-True-Range
        // smooth with EMA. These produce different results
        averageTrueRange = ((averageTrueRange * (periods - 1)) + trueRange) / periods;
        return {
            overlay: false,
            value: averageTrueRange
        };
    }
}