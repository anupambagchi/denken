#hint:<b>HullTrend</b>\nThis indicator simply tells the trend depending on the position of the typical price relative to the Hull.

declare lower;

input price = open;
input hullslowlength = 20;
input hullfastlength = 9;
input displace = 0;

input fastLength = 84;
input slowLength = 182;
input MACDLength = 63;

def slowhalflength = Ceil(hullslowlength / 2);
def slowsqrtlength = Ceil(Sqrt(hullslowlength));
def slowval = 2 * wma(price, slowhalflength) - wma(price, hullslowlength);
def slowHMA = wma(slowval, slowsqrtlength)[-displace];

def fasthalflength = Ceil(hullfastlength / 2);
def fastsqrtlength = Ceil(Sqrt(hullfastlength));
def fastval = 2 * wma(price, fasthalflength) - wma(price, hullfastlength);
def fastHMA = wma(slowval, fastsqrtlength)[-displace];

plot Diff = MACD(fastLength, slowLength, MACDLength).Diff;

Diff.SetDefaultColor(GetColor(5));
Diff.SetPaintingStrategy(PaintingStrategy.LINE);
Diff.SetLineWeight(2);
Diff.DefineColor("Up", Color.DARK_GREEN);
Diff.DefineColor("Down", Color.RED);
Diff.DefineColor("Neutral", Color.YELLOW);
def isUp = (Diff > 0) and (fastHMA > slowHMA);
def isDown = (Diff < 0) and (fastHMA < slowHMA);
Diff.AssignValueColor(if isUp then Diff.color("Up") else if isDown then Diff.color("Down") else Diff.color("Neutral") );

def drawBuy = isUp and !isUp[1];
def drawSell = isDown and !isDown[1];

AddChartBubble(drawBuy, Diff, "B", Color.DARK_GREEN, No);
AddChartBubble(drawSell, Diff, "S", Color.RED, Yes);