declare lower;

input price = close;
input length = 14;
input smoothingPeriod = 5;

def MaxBound = HighestWeighted(high, length, LinearRegressionSlope(price=high, length=length));
def MinBound = LowestWeighted(low, length, LinearRegressionSlope(price=low, length=length));
def diff = MaxBound - MinBound;

plot PROSC = if diff != 0 then 100 * (price - MinBound) / diff else 0;
plot PROSCSmoothed = Average(PROSC, smoothingPeriod);
def PROSCAvg2 = Average(PROSC, smoothingPeriod - 2);

plot OverBought = 80;
plot OverSold = 20;

OverBought.setDefaultColor(getColor(5));
OverSold.setDefaultColor(getColor(5));

PROSCSmoothed.DefineColor("Positive", Color.BLUE);
PROSCSmoothed.DefineColor("Negative", Color.RED);
PROSC.DefineColor("Positive", Color.DARK_GREEN);
PROSC.DefineColor("Negative", Color.DARK_RED);

PROSCSmoothed.AssignValueColor(if PROSCSmoothed > 50 then PROSCSmoothed.color("Positive") else  PROSCSmoothed.color("Negative"));
PROSCSmoothed.SetLineWeight(2);

PROSC.AssignValueColor(if PROSC > 50 then PROSC.color("Positive") else  PROSC.color("Negative"));

plot Conv = PROSCAvg2 - PROSCSmoothed;

Conv.SetDefaultColor(GetColor(5));
Conv.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Conv.SetLineWeight(3);
Conv.DefineColor("Positive and Up", Color.GREEN);
Conv.DefineColor("Positive and Down", Color.DARK_GREEN);
Conv.DefineColor("Negative and Down", Color.RED);
Conv.DefineColor("Negative and Up", Color.DARK_RED);
Conv.AssignValueColor(if Conv >= 0 then if Conv > Conv[1] then Conv.color("Positive and Up") else Conv.color("Positive and Down") else if Conv < Conv[1] then Conv.color("Negative and Down") else Conv.color("Negative and Up"));
