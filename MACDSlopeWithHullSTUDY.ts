declare lower;

input fastLength = 12;
input slowLength = 26;
input MACDLength = 9;
input AverageType = {SMA, default EMA};
input price = open;
input HullPeriod = 9;

plot Diff = MACD(fastLength, slowLength, MACDLength, AverageType).Diff;

Diff.SetDefaultColor(GetColor(5));
Diff.SetPaintingStrategy(PaintingStrategy.LINE);
Diff.SetLineWeight(2);
Diff.DefineColor("Up", Color.GREEN);
Diff.DefineColor("Down", Color.RED);
Diff.DefineColor("Neutral", Color.ORANGE);

def hull = HullMovingAvg(price, HullPeriod, 0);

def isUP;
def isDOWN;
def isNEUTRAL;

if hull >= hull[1] && Diff >= Diff[1]
then {
    isUP = yes;
    isDOWN = no;
    isNEUTRAL = no;
} else {
    if hull <= hull[1] && Diff <= Diff[1]
    then {
        isUP = no;
        isDOWN = yes;
        isNEUTRAL = no;
    } else {
        isUP = no;
        isDOWN = no;
        isNEUTRAL = yes;
    }
}

Diff.AssignValueColor(if isUP == yes then Diff.color("Up") else if isDOWN == yes then Diff.color("Down") else Diff.color("Neutral"));
