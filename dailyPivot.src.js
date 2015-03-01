var msDay = 86400000,
    today,
    dailyPivot,
    R1,
    S1,
    R2,
    S2,
    R3,
    S3;


function getBufferSize () {
    return 200;
}

function onIntervalClose () {
  
    var yesterdayHLC;

    if (!dailyPivot || today !== TIME.getUTCDay()) {

        today = TIME.getUTCDay();

        yesterdayHLC = getYesterdayHLC();

        dailyPivot = Math.mean(yesterdayHLC);

        R1 = (dailyPivot * 2) - yesterdayHLC[1];
        S1 = (dailyPivot * 2) - yesterdayHLC[0];

        R2 = dailyPivot + (yesterdayHLC[0] - yesterdayHLC[1]);
        S2 = dailyPivot - (yesterdayHLC[0] - yesterdayHLC[1]);

        R3 = R1 + (yesterdayHLC[0] - yesterdayHLC[1]);
        S3 = S1 - (yesterdayHLC[0] - yesterdayHLC[1]);
    }

    return [{
            name: 'R3',
            value: R3,
            color: "#90ed7d"
        }, {
            name: "R2",
            value: R2,
            color: "#90ed7d"
        }, {
            name: "R1",
            value: R1,
            color: "#90ed7d"
        }, {
            name: "dailyPivot",
            value: dailyPivot,
            color: "#7cb5ec"
        }, {
            name: "S1",
            value: S1,
            color: "#f15c80"
        }, {
            name: "S2",
            value: S2,
            color: "#f15c80"
        }, {
            name: "S3",
            value: S3,
            color: "#f15c80"
        }];

}

function getYesterdayHLC () {

    var lastMidnight = TIME.getTime() - (TIME.getTime() % msDay),
        start = new Date(lastMidnight - msDay),
        end = new Date(lastMidnight),
        closes;

    // If Sunday
    if (TIME.getUTCDay() === 0) {
        
        // Pivot calculated from Thursday's bar
        start = new Date(lastMidnight - (3 * msDay));
        end = new Date(lastMidnight - (2 * msDay));
        
    // If Monday
    } else if (TIME.getUTCDay() === 1) {
        
        // Pivot calculated from Friday/Sunday bar
        start = new Date(lastMidnight - (3 * msDay));
        end = new Date(lastMidnight);
    }

    closes = prices.close(start, end); // Improve to retrieve only single bar (once added to API)

    return [
        Math.highest(prices.high(start, end)),
        Math.lowest(prices.low(start, end)),
        closes[closes.length - 1]
    ];
}