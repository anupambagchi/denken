declare lower;

input fastLength = 12;
input slowLength = 26;
input MACDLength = 9;
input AverageType = {SMA, default EMA};
input price = open;
input AlertforBuy = No;
input AlertforSell = No;

def Value;
def Avg;

switch (AverageType) {
case SMA:
    Value = Average(price, fastLength) - Average(price, slowLength);
    Avg = Average(Value, MACDLength);
case EMA:
    Value = ExpAverage(price, fastLength) - ExpAverage(price, slowLength);
    Avg = ExpAverage(Value, MACDLength);
}

plot Diff = Value - Avg;
# plot Diff = MACD(fastLength, slowLength, MACDLength, AverageType).Diff;
input crossingType = {default "Positive to Negative", "Negative to Positive"};

Diff.SetDefaultColor(GetColor(5));
Diff.SetPaintingStrategy(PaintingStrategy.LINE);
Diff.SetLineWeight(2);
Diff.DefineColor("Up", Color.GREEN);
Diff.DefineColor("Down", Color.RED);
Diff.DefineColor("Neutral", Color.ORANGE);
Diff.AssignValueColor(if Diff > Diff[1] then Diff.color("Up") else if Diff < Diff[1] then Diff.color("Down") else Diff.color("Neutral"));

plot Hist = Diff;
Hist.SetDefaultColor(GetColor(5));
Hist.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Hist.SetLineWeight(3);
Hist.DefineColor("Positive and Up", Color.GREEN);
Hist.DefineColor("Positive and Down", Color.GRAY);
Hist.DefineColor("Negative and Down", Color.RED);
Hist.DefineColor("Negative and Up", Color.GRAY);
Hist.AssignValueColor(if Hist >= 0 then if Hist > Hist[1] then Hist.color("Positive and Up") else Hist.color("Positive and Down") else if Diff < Hist[1] then Hist.color("Negative and Down") else Hist.color("Negative and Up"));

def isDown = (Value <= 0) and (Diff <= Diff[1]) and (Diff[1] <= Diff[2]) and (Diff[2] >= Diff[3]) and (Diff[3] >= Diff[4]);
def isUp = (Value >= 0) and (Diff >= Diff[1]) and (Diff[1] >= Diff[2]) and (Diff[2] <= Diff[3]) and (Diff[3] <= Diff[4]);

AddChartBubble(isUp, Hist, "B", Color.DARK_GREEN, No);
AddChartBubble(isDown, Hist, "S", Color.RED, Yes);

Alert(isUp and alertforBUY, concat(open, concat(concat("BUY signal for ",getUnderlyingSymbol())," from MACDSlope ")), Alert.BAR, Sound.Ring);
Alert(isDown and alertforSELL, concat(open, concat(concat("SELL signal for ",getUnderlyingSymbol())," from MACDSlope ")), Alert.BAR, Sound.Ring);

