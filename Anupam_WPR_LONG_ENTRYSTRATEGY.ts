declare LONG_ENTRY;

input length = 79;
input overBought = -20;
input overSold = -80;
input smoothingPeriod = 14;
input tradeSize = 1;

def MorningOpenHour = 8;
def MorningCloseHour = 12.5;
def AfternoonOpenHour = 13.5;
def AfternoonCloseHour = 16;

input tqfastLength = 7;
input tqslowLength = 15;
input tqtrendLength = 4;
input tqnoiseType = {default linear, squared};
input tqnoiseLength = 250;
input tqcorrectionFactor = 2;
input TrendThreshold = 1;

def TrendQ = TrendQuality(tqfastlength, tqslowlength, tqtrendLength, tqnoiseType, tqnoiseLength, tqcorrectionFactor);
def trendqualitygood = TrendQ > TrendThreshold;

def secondsSinceMidnight = secondsFromTime(0);
def safetimemorning = secondsSinceMidnight > MorningOpenHour * 60 * 60 and  secondsSinceMidnight < MorningCloseHour * 60 * 60;
def safetimeafternoon = secondsSinceMidnight > AfternoonOpenHour * 60 * 60 and secondsSinceMidnight < AfternoonCloseHour * 60 * 60;
def safetime = safetimemorning or safetimeafternoon;

def WilliamsPercentSmoothed = Average(WilliamsPercentR(length, overBought, overSold), smoothingPeriod);
def WP_Hull = Average(WilliamsPercentR(length, overBought, overSold), 5);

def CrossUp = WilliamsPercentSmoothed > -50 && WilliamsPercentSmoothed[1] <= -50;

SetColor(GetColor(1));

addOrder(CrossUp and safetime, open[-1], tradeSize);
alert(CrossUp and safetime, "WPR Long Entry.", Alert.BAR, Sound.NoSound);
