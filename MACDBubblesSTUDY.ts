declare lower;

input price = open;

input fastLength1 = 84;
input slowLength1 = 182;
input MACDLength1 = 63;
input AverageType1 = {SMA, default EMA};

input fastLength2 = 12;
input slowLength2 = 26;
input MACDLength2 = 9;
input AverageType2 = {SMA, default EMA};

def Value1;
def Avg1;

def Value2;
def Avg2;

switch (AverageType1) {
case SMA:
    Value1 = Average(price, fastLength1) - Average(price, slowLength1);
    Avg1 = Average(Value1, MACDLength1);
case EMA:
    Value1 = ExpAverage(price, fastLength1) - ExpAverage(price, slowLength1);
    Avg1 = ExpAverage(Value1, MACDLength1);
}

plot Diff1 = Value1 - Avg1;
input crossingType = {default "Positive to Negative", "Negative to Positive"};

Diff1.SetDefaultColor(GetColor(5));
Diff1.SetPaintingStrategy(PaintingStrategy.LINE);
Diff1.SetLineWeight(2);
Diff1.DefineColor("Up", Color.GREEN);
Diff1.DefineColor("Down", Color.RED);
Diff1.DefineColor("Neutral", Color.ORANGE);
Diff1.AssignValueColor(if Diff1 > Diff1[1] then Diff1.color("Up") else if Diff1 < Diff1[1] then Diff1.color("Down") else Diff1.color("Neutral"));

plot Hist1 = Diff1;
Hist1.SetDefaultColor(GetColor(5));
Hist1.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Hist1.SetLineWeight(3);
Hist1.DefineColor("Positive and Up", Color.GREEN);
Hist1.DefineColor("Positive and Down", Color.GRAY);
Hist1.DefineColor("Negative and Down", Color.RED);
Hist1.DefineColor("Negative and Up", Color.GRAY);
Hist1.AssignValueColor(if Hist1 >= 0 then if Hist1 > Hist1[1] then Hist1.color("Positive and Up") else Hist1.color("Positive and Down") else if Diff1 < Hist1[1] then Hist1.color("Negative and Down") else Hist1.color("Negative and Up"));

switch (AverageType2) {
case SMA:
    Value2 = Average(price, fastLength2) - Average(price, slowLength2);
    Avg2 = Average(Value2, MACDLength2);
case EMA:
    Value2 = ExpAverage(price, fastLength2) - ExpAverage(price, slowLength2);
    Avg2 = ExpAverage(Value2, MACDLength2);
}

def Diff2 = Value2 - Avg2;

# Transitions using slope change of both
#def isUp = (Diff2 > Diff2[1]) and (Diff1 > Diff1[1]);
#def isDown = (Diff2 < Diff2[1]) and (Diff1 < Diff1[1]);

#def drawBuy = isUp and !isUp[1];
#def drawSell = isDown and !isDown[1];

# Transitions using value of 1 and slope of other
def isUpA = (Diff2 >= 0) and (Diff2[1] < 0) and (Diff1 > Diff1[1]);
def isDownA = (Diff2 <= 0) and (Diff2[1] > 0) and (Diff1 < Diff1[1]);

def isUpB = (Diff1 > Diff1[1]) and (Diff1[2] >= Diff1[1]) and (Diff2 >= 0 );
def isDownB = (Diff1 < Diff1[1]) and (Diff1[2] <= Diff1[1]) and (Diff2 <= 0);

def drawBuy = isUpA or isUpB;
def drawSell = isDownA  or isDownB;

AddChartBubble(drawBuy, Diff1, "B", Color.DARK_GREEN, No);
AddChartBubble(drawSell, Diff1, "S", Color.RED, Yes);
