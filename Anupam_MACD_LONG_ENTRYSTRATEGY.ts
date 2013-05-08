declare LONG_ENTRY;

input fastLength = 180;
input slowLength = 208;
input MACDLength = 72;
input AverageType = {SMA, default EMA};
input tradeSize = 1;

input tqfastLength = 7;
input tqslowLength = 15;
input tqtrendLength = 4;
input tqnoiseType = {default linear, squared};
input tqnoiseLength = 250;
input tqcorrectionFactor = 2;
input TrendThreshold = 3;

def MorningOpenHour = 9;
def MorningCloseHour = 12.5;
def AfternoonOpenHour = 13.5;
def AfternoonCloseHour = 16;

def secondsSinceMidnight = secondsFromTime(0);
def safetimemorning = secondsSinceMidnight > MorningOpenHour * 60 * 60 and  secondsSinceMidnight < MorningCloseHour * 60 * 60;
def safetimeafternoon = secondsSinceMidnight > AfternoonOpenHour * 60 * 60 and secondsSinceMidnight < AfternoonCloseHour * 60 * 60;
def safetime = safetimemorning or safetimeafternoon;

def Diff = MACD(fastLength, slowLength, MACDLength, AverageType).Diff;

def TrendQ = TrendQuality(tqfastlength, tqslowlength, tqtrendLength, tqnoiseType, tqnoiseLength, tqcorrectionFactor);

def condition_new = Diff > 0 and Diff[1] <= 0;
def condition_resume = Diff > Diff[1] and Diff[1] > Diff[2] and Diff > 0;
def condition = condition_new or condition_resume;
# def condition = condition_resume;

def trendqualitygood = TrendQ > TrendThreshold;
def trendqualityrising = TrendQ > TrendThreshold and TrendQ[1] <= TrendThreshold;

def macdcondition = condition and trendqualitygood;
def trendqcondition = trendqualityrising and Diff > 0;
 
SetColor(GetColor(1));

addOrder(macdcondition or trendqcondition and safetime, open[-1], tradeSize);
alert(macdcondition or trendqcondition and safetime, "MACD Long Entry.", Alert.BAR, Sound.NoSound);
