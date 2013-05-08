declare SHORT_ENTRY;

input price = ohlc4;
input length = 10;
input displace = 0;
input tradeSize = 1;
input AverageType = {SMA, default EMA};

input trailType = {default modified, unmodified};
input ATRPeriod = 5;
input ATRFactor = 3.5;
input firstTrade = {default long, short};

input fastLength = 12;
input slowLength = 26;
input MACDLength = 9;

input MorningOpenHour = 9;
input MorningCloseHour = 16;

input UseATR = {default On, Off};

def secondsSinceMidnight = secondsFromTime(0);
def tradetime = secondsSinceMidnight > MorningOpenHour * 60 * 60 and  secondsSinceMidnight < MorningCloseHour * 60 * 60;

def halflength = Ceil(length / 2);
def sqrtlength = Ceil(Sqrt(length));
def val = 2 * wma(price, halflength) - wma(price, length);
def HMA = wma(val, sqrtlength)[-displace];
def atrvalue = ATRTrailingStop(trailType, ATRPeriod, ATRFactor, firstTrade);

def hullwithatr;
def atrwithhull;

def hullchange = HMA < HMA[1] and HMA[1] >= HMA[2];

switch (UseATR) {
case On:
    hullwithatr = HMA < HMA[1] and HMA[1] >= HMA[2] and atrvalue > ohlc4;
    atrwithhull = atrvalue > ohlc4 and atrvalue[1] < ohlc4[1] and HMA < HMA[1];
case Off:
    hullwithatr = hullchange;
    atrwithhull = hullchange;
}

def Diff = MACD(fastLength, slowLength, MACDLength, AverageType).Diff;
def macddirection = Diff < 0;

def entrycondition = hullwithatr or atrwithhull;

SetColor(GetColor(1));

addOrder(entrycondition and macddirection and tradetime, open[-1], tradeSize);
alert(entrycondition and macddirection and tradetime, "7AM Short Entry.", Alert.BAR, Sound.NoSound);