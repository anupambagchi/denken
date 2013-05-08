declare SHORT_ENTRY;

input trailType = {default modified, unmodified};
input ATRPeriod = 5;
input ATRFactor = 3.5;
input firstTrade = {default long, short};
input tradeSize = 1;

input length = 79;
input overBought = -20;
input overSold = -80;
input smoothingPeriod = 14;

input tqfastLength = 7;
input tqslowLength = 15;
input tqtrendLength = 4;
input tqnoiseType = {default linear, squared};
input tqnoiseLength = 250;
input tqcorrectionFactor = 2;
input TrendThreshold = 1;

def TrendQ = TrendQuality(tqfastlength, tqslowlength, tqtrendLength, tqnoiseType, tqnoiseLength, tqcorrectionFactor);
def trendqualitygood = TrendQ < -TrendThreshold;

def MorningOpenHour = 9;
def MorningCloseHour = 12.5;
def AfternoonOpenHour = 13.5;
def AfternoonCloseHour = 16;

def secondsSinceMidnight = secondsFromTime(0);
def safetimemorning = secondsSinceMidnight > MorningOpenHour * 60 * 60 and  secondsSinceMidnight < MorningCloseHour * 60 * 60;
def safetimeafternoon = secondsSinceMidnight > AfternoonOpenHour * 60 * 60 and secondsSinceMidnight < AfternoonCloseHour * 60 * 60;
def safetime = safetimemorning or safetimeafternoon;

def WilliamsPercentSmoothed = Average(WilliamsPercentR(length, overBought, overSold), smoothingPeriod);
def atrbuy = ATRTrailingStop(trailType, ATRPeriod, ATRFactor, firstTrade).sellSignal and WilliamsPercentSmoothed < -50;

SetColor(GetColor(0));

addOrder(atrbuy and safetime and trendqualitygood, open[-1], tradeSize);
alert(atrbuy and safetime and trendqualitygood, "ATR Short Entry.", Alert.BAR, Sound.NoSound);
