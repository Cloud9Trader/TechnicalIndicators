function getBufferSize (periods) {
    return periods;
}

function onIntervalClose (periods) {

    var aroonValue = aroon(periods);

    return {
        value: aroonValue[0] - aroonValue[1], // aroonUp - aroonDown
        type: "area",
        overlay: false,
        tooltip: {
            valueDecimals: 1
        }
    };
}