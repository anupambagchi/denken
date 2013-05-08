declare lower;

input length = 2;
input over_Bought = 90;
input over_Sold = 10;
input price = close;
input smoothingPeriod = 3;

def NetChgAvg = WildersAverage(price - price[1], length);
def TotChgAvg = WildersAverage(AbsValue(price - price[1]), length);
def ChgRatio = if TotChgAvg != 0 then NetChgAvg / TotChgAvg else 0;

plot RSI = 50 * (ChgRatio + 1);
plot OverSold = over_Sold;
plot OverBought = over_Bought;
plot RSICumulative = Average(RSI, smoothingPeriod);

RSI.DefineColor("OverBought", GetColor(5));
RSI.DefineColor("Normal", GetColor(7));
RSI.DefineColor("OverSold", GetColor(1));
RSI.AssignValueColor(if RSI > over_Bought then RSI.color("OverBought") else if RSI < over_Sold then RSI.color("OverSold") else RSI.color("Normal"));
OverSold.SetDefaultColor(GetColor(8));
OverBought.SetDefaultColor(GetColor(8));

RSICumulative.DefineColor("UP", GetColor(3));
RSICumulative.DefineColor("Down", GetColor(2));
RSICumulative.AssignValueColor(if RSICumulative > RSICumulative[1] then RSICumulative.color("UP") else RSICumulative.color("DOWN"));

OverSold.SetDefaultColor(GetColor(8));
OverBought.SetDefaultColor(GetColor(8));
