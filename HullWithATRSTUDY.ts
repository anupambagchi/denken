input price = close;
input length = 20;
input displace = 0;

input trailType = {default modified, unmodified};
input ATRPeriod = 5;
input ATRFactor = 3.5;
input firstTrade = {default long, short};
input tradeSize = 1;

def halflength = Ceil(length / 2);
def sqrtlength = Ceil(Sqrt(length));
def val = 2 * wma(price, halflength) - wma(price, length);

plot HMA = wma(val, sqrtlength)[-displace];
HMA.SetDefaultColor(GetColor(1));

HMA.SetLineWeight(2);
HMA.DefineColor("Positive", Color.BLUE);
HMA.DefineColor("Negative", Color.RED);
HMA.DefineColor("Neutral", Color.ORANGE);

def atrvalue = ATRTrailingStop(trailType, ATRPeriod, ATRFactor, firstTrade);

HMA.AssignValueColor(if HMA > HMA[1] and atrvalue < close then HMA.color("Positive") else if HMA < HMA[1] and atrvalue > close then HMA.color("Negative") else HMA.color("Neutral"));
