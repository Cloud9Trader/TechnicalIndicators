var previousMidpoint,
    eoms = [];

function getRunUpCount (periods) {
    return periods;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("Ease of Movement periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Ease of Movement periods must be an integer");
    }
    if (periods > 100) {
        error("Ease of Movement maximum periods is 100");
    }
    if (periods <= 0) {
        error("Ease of Movement periods must be greater than zero");
    }
}

function onIntervalClose (periods) {
    
    var midpoint = (HIGH + LOW) / 2,
        distanceMoved,
        boxRatio,
        eom;
    
    if (previousMidpoint === undefined) {
        previousMidpoint = (HIGH + LOW) / 2;
        return null;
    }
    
    distanceMoved = midpoint - previousMidpoint;
    
    // TODO Volume is divided by 100m to make relevant to other numbers (for stock volume)
    // Probably then need to adjust depending on instrument tick size
    boxRatio = (VOLUME / 100000000) / (HIGH - LOW);
    
    eom = distanceMoved / boxRatio;
        
        
    previousMidpoint = midpoint;
    
    eoms.push(eom);
    
    if (eoms.length < periods) {
        return null;
    } else if (eoms.length > periods){
        eoms.shift();
    }
    
    return {
        overlay: false,
        value: Math.average(eoms)
    };
}