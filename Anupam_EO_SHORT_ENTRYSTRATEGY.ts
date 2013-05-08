declare SHORT_ENTRY;

input price = open;
input shortLength = 50;
input longLength = 350;
input tradeSize = 1;

def MorningOpenHour = 9;
def MorningCloseHour = 12.5;
def AfternoonOpenHour = 12.5;
def AfternoonCloseHour = 16;

def secondsSinceMidnight = secondsFromTime(0);
def safetimemorning = secondsSinceMidnight > MorningOpenHour * 60 * 60 and  secondsSinceMidnight < MorningCloseHour * 60 * 60;
def safetimeafternoon = secondsSinceMidnight > AfternoonOpenHour * 60 * 60 and secondsSinceMidnight < AfternoonCloseHour * 60 * 60;
def safetime = safetimemorning or safetimeafternoon;

def ElliotOsc = Average(price, shortLength) - Average(price, longLength);
def WilliamsPercentSmoothed = Average(WilliamsPercentR(279, -20, -80), 25);

def condition1 = ElliotOsc < 0 and ElliotOsc[1] >= 0 and WilliamsPercentSmoothed < -50;
def condition2 = ElliotOsc < 0 and WilliamsPercentSmoothed < -50 and WilliamsPercentSmoothed[1] >= -50;
def condition = condition1 or condition2;

addOrder(condition and safetime, open[-1], tradeSize);
alert(condition and safetime, "Elliot Oscillator Short Entry.", Alert.BAR, Sound.Bell);
