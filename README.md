Technical Indicators
===================

#####Technical indicator and overlay scripts for use in [www.cloud9trader.com](https://www.cloud9trader.com) charts and trading algorithms.


These indicator scripts, written in JavaScript, power the built in technical indicators on the platform.

Their job is to derive a value, or set of values, from price data at any given moment in time to be drawn onto charts as one or several overlays or studies. They can also be used inside your Cloud9Trader trading scripts.

We've included them in this repository so that you can use them as a reference to help build your own indicators - just create a new indicator on the 'Algorithms' screen and copy the code in.

They're also here for those who are just interested in the maths behind technical analysis.

If you spot any issues with them or would like to add your own indicator to Cloud9Trader's built in collection, we'd be very grateful for your pull requests.


###Functions

The indicators will contain at minimum an 'onIntervalClose' function and some or all of the following:

* `onIntervalClose()` Required. Called every bar close. Its job is to return the current indicator value(s) (and any chart config), so is generally where you'll find most of the logic.

* `onStart()` Optional. Called once run up price data has loaded with any user input parameters. Used to validate these and initialize any variables that are globally scoped (i.e. persist between updates)

* `getRunUpCount()` Optional. Tells the system how many intervals of previous price data to load in that are needed to produce the first value. This is often the n `periods` of the indicator. This is also called with any user input parameters.

* `getStudyAxisConfig()` Optional. Configures the study chart axis for indicators that produce one.


###Documentation

You can find plenty of info for writing your own indicators in the Cloud9Trader documentation pages. See [Writing Your Technical Indicators](https://www.cloud9trader.com/documentation/writing-your-technical-indicators).

For the technical indicator API see [Technical Indicators API Reference](https://www.cloud9trader.com/documentation/api-reference/technical-indicators-api-reference).

For the API for using these in your trading algorithms see [Algorithms API Reference](https://www.cloud9trader.com/documentation/api-reference/algorithms-api-reference#technical-indicators).



###Indicators

* Accumulation Distribution Line `adl()`
* Aroon `aroon(periods)`
* Aroon Oscillator `aroonOscillator(periods)`
* Average True Range `atr(periods)`
* Bollinger Bands `bollinger(periods, deviations)`
* Bollinger Bandwidth `bollingerBandwidth(periods, deviations)`
* Bollinger %B `bollingerB(periods, deviations)`
* Commodity Channel Index `cci(periods, constant)`
* Chandelier Exit `chandelierExit(periods, multiplier)`
* Chaikin Money Flow `cmf(periods)`
* Chande Momentum Oscillator `cmo(periods, signalPeriods)`
* Center of Gravity Oscillator `cog(periods, signalPeriods)`
* Coppock Curve `coppock(firstRoCPeriods, wmaPeriods, secondRoCPeriods)`
* Daily Pivot `dailyPivot()`
* Detrended Price Oscillator `dpo(periods)`
* Elder Bull/Bear Power `elderBBPower(periods)`
* Exponential Moving Average `ema(periods)`
* Exponential Moving Average Envelope`emaEnvelope(periods, envelope)`
* Ease of Movement `emv(periods)`
* Fisher Transform `fisherTransform(periods)`
* Force Index `forceIndex(periods)`
* Gopalakrishnan Range Index `gapo(periods)`
* Ichimoku Cloud `ichimokuCloud(conversionLinePeriods, baseLinePeriods, leadingSpanPeriods, laggingSpanPeriods)`
* Keltner Channels `keltnerChannels(emaPeriods, atrPeriods, atrMultiplier)`
* Know Sure Thing `kst(firstROCPeriods, secondROCPeriods, thirdROCPeriods, fourthROCPeriods, firstSMAPeriods, second`thirdSMAPeriods, fourthSMAPeriods[, signalSMA])</span></h3>
* MACD `macd(fastEMAPeriods, slowEMAPeriods[, signalEMAPeriods])`
* MACD Histogram `macdHistogram(fastEMAPeriods, slowEMAPeriods, signalEMAPeriods)`
* Mass Index `macdHistogram(emaPeriods, summationPeriods)`
* Money Flow Index `mfi(periods)`
* On Balance Volume `obv()`
* Percentage Price Oscillator `ppo(fastEMAPeriods, slowEMAPeriods[, signalEMAPeriods])`
* Pretty Good Oscillator `pgo(periods)`
* Price Channels `priceChannels(periods)`
* Price Momentum Oscillator `pmo(firstEMAPeriods, secondEMAPeriods[, signalEMAPeriods])`
* Price Volume Oscillator `pvo(fastEMAPeriods, slowEMAPeriods, signalEMAPeriods)`
* QStick `qStick(periods)`
* Rate of Change `roc(periods)`
* Relative Strength Index `rsi(periods)`
* Simple Moving Average `sma(periods)`
* Simple Moving Average Envelope `smaEnvelope(periods, envelope)`
* Standard Deviation `standardDeviation(periods, envelope)`
* Stochastic Oscillator `stochasticOscillator(periods, smaPeriods)`
* StochRSI `stochRsi(periods)`
* TRIX `trix(periods[, signalPeriods])`
* True Strength Index `tsi(firstPeriods, secondPeriods[, signalPeriods])`
* Ultimate Oscillator `uo(shortPeriods, mediumPeriods, longPeriods)`
* Volume `volume()`
* Vortex Indicator `vtx(periods)`
* Wilders Moving Average `wilderMA(periods)`
* Williams %R `williamsR(periods)`
* Weighted Moving Average `wma(periods)`
