var values = [];

function getRunUpCount (periods) {
    return periods;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Rate Of Change periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Rate Of Change periods must be an integer");
    }
    if (periods > 100) {
        error("Rate Of Change maximum periods is 100");
    }
    if (periods <= 0) {
        error("Rate Of Change periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    var periodStartClose;
    
    values.push(CLOSE);
    
    if (values.length < periods) {
        return null;
    }
    
    // Splice occasionally
    if (values.length > periods * 3)  {
        values.splice(0, values.length - periods);
    }
    
    periodStartClose = values[values.length - periods];
    
    return {
        overlay: false,
        value: ((CLOSE - periodStartClose) / periodStartClose) / 100
    };
}