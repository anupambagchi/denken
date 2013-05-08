declare upper;

input price = open;
input AlertEnabled = {true, default false};
input trailType = {default modified, unmodified};
input firstTrade = {default long, short};
input aggressiveATRTrading = {default false, true};
input showATRTrades = {default true, false};
input showKeltnerTrades = {default true, false};
input ATRFactor = 4.3;
input longEMA = 60;

def dayPrice = open(period="DAY");
plot dayEma = ExpAverage(dayPrice,12);

def displace = 0;
def factor = 0.8;
def length = 20;
def emaLength = 168;

def MACDFastPeriod = 12;
def MACDSlowPeriod = 26;
def MACDlength = 9;

def shift = factor * AvgTrueRange(high, close, low, length);
def average = Average(price, length);
def ema1 = ExpAverage(price,emaLength);
plot emaShort1 = ExpAverage(price,round(emaLength*0.5,0));

def ATRPeriod = 10;

def ts;
def ema = ExpAverage(price,longEMA);
def emaShort = ExpAverage(price,round(longEMA*0.5,0));
ts = ATRTrailingStop(trailType, ATRPeriod, ATRFactor, firstTrade);

rec up;
rec down;

switch (aggressiveATRTrading) {
case true:
	up = ((price > ts) and (price[1] < ts[1]) and (emaShort1 > dayEma)) OR ((price[1] > ts[1]) and (price[2] < ts[2]) and (ts > ts[1])) OR ((price[2] > ts[2]) and (price[3] < ts[3]) and (ts[2] == ts[1]) and (ts > ts[1]));
	down = ((price < ts) and (price[1] > ts[1]) and (emaShort1 < dayEma)) OR ((price[1] < ts[1]) and (price[2] > ts[2]) and (ts < ts[1])) OR ((price[2] < ts[2]) and (price[3] > ts[3]) and (ts[2] == ts[1]) and (ts < ts[1]));
case false:
	up = (((price > ts) and (price[1] < ts[1])) OR ((price[1] > ts[1]) and (price[2] < ts[2]) and (ts > ts[1])) OR ((price[2] > ts[2]) and (price[3] < ts[3]) and (ts[2] == ts[1]) and (ts > ts[1]))) and (emaShort1 > dayEma);
	down = (((price < ts) and (price[1] > ts[1])) OR ((price[1] < ts[1]) and (price[2] > ts[2]) and (ts < ts[1])) OR ((price[2] < ts[2]) and (price[3] > ts[3]) and (ts[2] == ts[1]) and (ts < ts[1]))) and (emaShort1 < dayEma);
}

rec upSignal;
rec downSignal;

switch (showATRTrades) {
case true:
	upSignal = up;
	downSignal = down;
case false:
	upSignal = Double.NaN;
	downSignal = Double.NaN;
}

AddChartBubble(upSignal,price,"A-B", Color.Green, No);
AddChartBubble(downSignal,price,"A-S", Color.Red, Yes);

def Avg = average[-displace];

def Upper = average[-displace] + shift[-displace];
rec Upper_Band = Upper - Avg;

def Lower = average[-displace] - shift[-displace];
rec Lower_Band = Lower - Avg;

rec PriceCurve = Average(price - Avg, 5);

def Diff = MACD(MACDFastPeriod, MACDSlowPeriod, MACDLength, "EMA").Diff;

#def dB = PriceCurve >= Lower_Band && PriceCurve[1] < Lower_Band[1] && PriceCurve[2] < Lower_Band[2] && Diff >= 0 && ema1 > ema1[1] && emaShort1 > emaShort1[1]  && (emaShort1 > dayEma);
#def dS = PriceCurve <= Upper_Band && PriceCurve[1] > Upper_Band[1] && PriceCurve[2] > Upper_Band[2] && Diff <= 0 && ema1 < ema1[1] && emaShort1 < emaShort1[1] && (emaShort1 < dayEma);

def dB = PriceCurve >= Lower_Band && PriceCurve[1] < Lower_Band[1] && PriceCurve[2] < Lower_Band[2] && Diff >= 0 && (emaShort1 > dayEma) && (dayEma >= dayEma[48]);
def dS = PriceCurve <= Upper_Band && PriceCurve[1] > Upper_Band[1] && PriceCurve[2] > Upper_Band[2] && Diff <= 0 && (emaShort1 < dayEma) && (dayEma <= dayEma[48]);

rec drawBuy;
rec drawSell;

switch (showKeltnerTrades) {
case true:
	drawBuy = dB;
	drawSell = dS;
case false:
	drawBuy = Double.NaN;
	drawSell = Double.NaN;
}

AddChartBubble(drawBuy,price,"K-B", Color.Light_Green, No);
AddChartBubble(drawSell,price,"K-S", Color.Light_Red, Yes);

alert(upSignal && AlertEnabled, "Buy signal from ATR Trailing Stop", Alert.BAR, Sound.Ding);
alert(downSignal && AlertEnabled, "Sell signal from ATR Trailing Stop", Alert.BAR, Sound.Ding);
alert(drawBuy && AlertEnabled, "Buy signal from Keltner", Alert.BAR, Sound.Ding);
alert(drawSell && AlertEnabled, "Sell signal from Keltner", Alert.BAR, Sound.Ding);
