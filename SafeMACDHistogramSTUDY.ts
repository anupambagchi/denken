#hint:<b>SafeMACDHistogram</b>\nThis indicator's coloring is based on a high order MACD line. It is assumed that it is safer to trade (low drawdown) when the MACD conencides with a higher order MACD.

declare lower;

input fastLength = 24;
input slowLength = 52;
input MACDLength = 18;
input higherfastLength = 180;
input higherslowLength = 208;
input higherMACDLength = 72;
input AverageType = {SMA, default EMA};

plot Diff = MACD(fastLength, slowLength, MACDLength, AverageType).Diff;
def HigherDiff = MACD(higherfastLength, higherslowLength, higherMACDLength, AverageType).Diff;

Diff.SetDefaultColor(GetColor(5));
Diff.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Diff.SetLineWeight(3);
Diff.DefineColor("Up", Color.GREEN);
Diff.DefineColor("Down", Color.RED);
Diff.DefineColor("Neutral", Color.ORANGE);
Diff.AssignValueColor(if Diff > 0 and HigherDiff > 0 then Diff.color("Up") else if Diff < 0 and HigherDiff < 0 then Diff.color("Down") else Diff.color("Neutral"));

