function getBufferSize () {
    return 0;
}

function onIntervalClose (periods) {
    return [{
        overlay: false,
        value: VOLUME,
        type: "column",
        tooltip: {
            valueDecimals: 0
        }
    }];
}