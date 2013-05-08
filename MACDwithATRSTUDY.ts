declare lower;

input fastLength = 350;
input slowLength = 400;
input MACDLength = 16;

input ATRPeriod = 15;
input ATRFactor = 1.0;

input trailType = {default modified, unmodified};
input firstTrade = {default long, short};

def atrvalue = ATRTrailingStop(trailType, ATRPeriod, ATRFactor, firstTrade);

rec Value;
rec Avg;
Value = WildersAverage(open, fastLength) - WildersAverage(open, slowLength);
Avg = WildersAverage(Value, MACDLength);

plot Diff = Value - Avg;
plot ZeroLine = 0;

Diff.SetLineWeight(4);
Diff.DefineColor("Positive", Color.GREEN);
Diff.DefineColor("Negative", Color.RED);
Diff.DefineColor("Neutral", Color.ORANGE);
Diff.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Diff.AssignValueColor(if Diff > Diff[1] and atrvalue[1] < open then Diff.color("Positive") else if Diff < Diff[1] and atrvalue[1] > open then Diff.color("Negative") else Diff.color("Neutral"));
