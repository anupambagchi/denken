declare lower;
declare all_for_one;

input over_bought = 80;
input over_sold = 20;
input KPeriod = 10;
input DPeriod = 10;
input priceH = high;
input priceL = low;
input priceC = close;
input slowing_period = 3;
input smoothingType = {Default SMA, EMA};
input smoothingFactor = 3;
input alertforBUY = No;
input alertforSELL = No;

def lowest_k = Lowest(priceL, KPeriod);
def c1 = priceC - lowest_k;
def c2 = Highest(priceH, KPeriod) - lowest_k;
def FastK = if c2 != 0 then c1 / c2 * 100 else 0;

plot FullK;
plot FullD;

switch (smoothingType) {
case SMA:
    FullK = Average(FastK, slowing_period * smoothingFactor);
    FullD = Average(FullK, DPeriod);
case EMA:
    FullK = ExpAverage(FastK, slowing_period * smoothingFactor);
    FullD = ExpAverage(FullK, DPeriod);
}

plot OverBought = over_bought;
plot OverSold = over_sold;

FullK.SetDefaultColor(GetColor(5));
OverBought.SetDefaultColor(GetColor(1));
OverSold.SetDefaultColor(GetColor(1));

FullK.DefineColor("Positive", Color.GREEN);
FullK.DefineColor("Negative", Color.RED);

FullK.AssignValueColor(if FullK > FullD then FullK.color("Positive") else  FullK.color("Negative"));

FullD.SetDefaultColor(GetColor(5));

FullD.DefineColor("Positive", Color.LIGHT_GRAY);
FullD.DefineColor("Negative", Color.LIGHT_RED);

FullD.AssignValueColor(if FullD > FullD[1] then FullD.color("Positive") else  FullD.color("Negative"));

def isDown = (FullD > FullK) and (FullD[1] <= FullK[1]) and (FullK >= 50);
def isUp = (FullK > FullD) and (FullK[1] <= FullD[1]) and (FullK <= 50);

AddChartBubble(isUp, FullK, "B", Color.DARK_GREEN, No);
AddChartBubble(isDown, FullD, "S", Color.RED, Yes);

Alert(isUp and alertforBUY, concat(open, concat(concat("BUY signal for ",getUnderlyingSymbol())," from StochasticCrossover ")), Alert.BAR, Sound.Ring);
Alert(isDown and alertforSELL, concat(open, concat(concat("SELL signal for ",getUnderlyingSymbol())," from StochasticCrossover ")), Alert.BAR, Sound.Ring);
