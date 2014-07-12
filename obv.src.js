var lastClose,
    onBalanceVolume = 0;

function getRunUpCount () {
    return 1;
}

function onIntervalClose () {

    if (lastClose === undefined) {
        lastClose = CLOSE;
        return null;
    }
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