declare lower;
declare weak_volume_dependency;

input displace = 0;
input factor = 1.0;
input length = 20;
input price = open;

def shift = factor * AvgTrueRange(high, price, low, length);
def average = Average(price, length);

def Avg = average[-displace];

def Upper = average[-displace] + shift[-displace];
plot Upper_Band = Upper - Avg;
Upper_Band.SetDefaultColor(GetColor(8));

def Lower = average[-displace] - shift[-displace];
plot Lower_Band = Lower - Avg;

plot PriceCurve = Average(price - Avg, 5);
PriceCurve.SetLineWeight(2);

Lower_Band.SetDefaultColor(GetColor(5));

PriceCurve.DefineColor("Too High", Color.GREEN);
PriceCurve.DefineColor("Too Low", Color.RED);
PriceCurve.DefineColor("Good Range", Color.CYAN);

PriceCurve.AssignValueColor(if PriceCurve > Upper_Band then PriceCurve.color("Too High") else if PriceCurve < Lower_Band then PriceCurve.color("Too Low") else PriceCurve.color("Good Range"));

def drawBuy = PriceCurve >= Lower_Band && PriceCurve[1] < Lower_Band[1] && PriceCurve[2] < Lower_Band[2];
def drawSell = PriceCurve <= Upper_Band && PriceCurve[1] > Upper_Band[1] && PriceCurve[2] > Upper_Band[2];

AddChartBubble(drawBuy,PriceCurve,"B", Color.Green, No);
AddChartBubble(drawSell,PriceCurve,"S", Color.Red, Yes);
alert(drawBuy, "BUY now. Moving UP into Keltner Channel.", Alert.BAR, Sound.Ding);
alert(drawSell, "SELL now. MovingAvgCrossover DOWN into Keltner Channel.", Alert.BAR, Sound.Ding);