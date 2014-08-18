var changes = [];

function getRunUpCount (periods) {
    return periods;
}

function getBufferSize (periods) {
    return 0;
}

function onStart (periods) {
    if (typeof periods !== "number") {
        error("QStick periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("QStick periods must be an integer");
    }
    if (periods > 100) {
        error("QStick maximum periods is 100");
    }
    if (periods <= 0) {
        error("QStick periods must be greater than zero");
    }
}

function onIntervalClose (periods) {

    changes.push((CLOSE - OPEN) / INSTRUMENT.PIP_SIZE);

    if (changes.length < periods) {
        return null;
    } else if (changes.length > periods) {
        changes.shift();
    }

    return {
        overlay: false,
        value: Math.average(changes)
    };
}