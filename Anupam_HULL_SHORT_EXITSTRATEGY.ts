declare SHORT_EXIT;

input price = ohlc4;
input length1 = 20;
input length2 = 60;
input length3 = 100;
input displace = 0;
input tradeSize = 1;
input AverageType = {SMA, default EMA};

def MorningOpenHour = 9;
def MorningCloseHour = 12.5;
def AfternoonOpenHour = 13.5;
def AfternoonCloseHour = 16;

def secondsSinceMidnight = secondsFromTime(0);
def safetimemorning = secondsSinceMidnight > MorningOpenHour * 60 * 60 and  secondsSinceMidnight < MorningCloseHour * 60 * 60;
def safetimeafternoon = secondsSinceMidnight > AfternoonOpenHour * 60 * 60 and secondsSinceMidnight < AfternoonCloseHour * 60 * 60;
def safetime = safetimemorning or safetimeafternoon;

def halflength1 = Ceil(length1 / 2);
def sqrtlength1 = Ceil(Sqrt(length1));
def val1 = 2 * wma(price, halflength1) - wma(price, length1);
def HMA1 = wma(val1, sqrtlength1)[-displace];
def condition1 = HMA1 > HMA1[1];
def condition1p = HMA1[1] > HMA1[2];

def halflength2 = Ceil(length2 / 2);
def sqrtlength2 = Ceil(Sqrt(length2));
def val2 = 2 * wma(price, halflength2) - wma(price, length2);
def HMA2 = wma(val2, sqrtlength2)[-displace];
def condition2 = HMA2 > HMA2[1];
def condition2p = HMA2[1] > HMA2[2];

def halflength3 = Ceil(length3 / 2);
def sqrtlength3 = Ceil(Sqrt(length3));
def val3 = 2 * wma(price, halflength3) - wma(price, length3);
def HMA3 = wma(val3, sqrtlength3)[-displace];
def condition3 = HMA3 > HMA3[1];
def condition3p = HMA3[1] > HMA3[2];

def isUP = condition1 and condition2 and condition3;
def isUPprevious = condition1p and condition2p and condition3p;

SetColor(GetColor(1));

addOrder(!isUP and isUPPrevious and safetime, open[-1], tradeSize);
