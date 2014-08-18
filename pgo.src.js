function getBufferSize (periods) {
    return periods;
}

function getRunUpCount (periods) {
    return periods * 2;
}

function getStudyAxisConfig () {
    return {
        gridLineWidth: 0,
        plotLines: [
            {value: -3, width: 1, color: "#EEE"},
            {value: 0, width: 1, color: "#EEE", dashStyle: "Dash"},
            {value: 3, width: 1, color: "#EEE"}
        ]
    };
}

function validate (periods) {
    if (typeof periods !== "number") {
        error("Pretty Good Oscillator periods must be a number");
    }
    if (periods % 1 !== 0) {
        error("Pretty Good Oscillator periods must be an integer");
    }
    if (periods > 100) {
        error("Pretty Good Oscillator maximum periods is 100");
    }
    if (periods <= 0) {
        error("Pretty Good Oscillator periods must be greater than zero");
    }
}

function onIntervalClose (periods) {
    return {
        overlay: false,
        value: (CLOSE - Math.average(prices(periods))) / atr(periods)
    };
}