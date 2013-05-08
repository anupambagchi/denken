declare LONG_ENTRY;

input tqfastLength = 52;
input tqslowLength = 15;
input tqtrendLength = 4;
input tqnoiseType = {default linear, squared};
input tqnoiseLength = 250;
input tqcorrectionFactor = 2;
input TrendThreshold = 3;
input tradeSize = 1;

def MorningOpenHour = 9;
def MorningCloseHour = 12.5;
def AfternoonOpenHour = 13.5;
def AfternoonCloseHour = 16;

def secondsSinceMidnight = secondsFromTime(0);
def safetimemorning = secondsSinceMidnight > MorningOpenHour * 60 * 60 and  secondsSinceMidnight < MorningCloseHour * 60 * 60;
def safetimeafternoon = secondsSinceMidnight > AfternoonOpenHour * 60 * 60 and secondsSinceMidnight < AfternoonCloseHour * 60 * 60;
def safetime = safetimemorning or safetimeafternoon;

def TrendQ = TrendQuality(tqfastlength, tqslowlength, tqtrendLength, tqnoiseType, tqnoiseLength, tqcorrectionFactor);

def trendqualityrising = TrendQ > TrendThreshold and TrendQ[1] <= TrendThreshold; 
SetColor(GetColor(1));

addOrder(trendqualityrising and safetime, open[-1], tradeSize);
alert(trendqualityrising and safetime, "TQ Long Entry.", Alert.BAR, Sound.NoSound);

