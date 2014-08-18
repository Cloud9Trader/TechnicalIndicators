// Accumulation Distribution Line

function getBufferSize () {
    return 0;
}

function onIntervalClose () {

    var top = (CLOSE - LOW) - (HIGH - CLOSE),
        moneyFlowMultiplier = top ? top / (HIGH - LOW) : 0,
        moneyFlowVolume = moneyFlowMultiplier * VOLUME;

    return {
        overlay: false,
        value: (VALUE || 0) + moneyFlowVolume
    };
}