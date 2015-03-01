var onBalanceVolume = 0;

function getBufferSize () {
    return 2;
}

function onIntervalClose () {

    var lastClose = price(1);

    if (CLOSE > lastClose) {
        onBalanceVolume += VOLUME;
    }
    if (CLOSE < lastClose) {
        onBalanceVolume -= VOLUME;
    }

    return {
        overlay: false,
        value: onBalanceVolume
    };
}