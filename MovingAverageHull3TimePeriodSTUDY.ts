#hint:<b>MovingAverageHull3TimePeriod</b>\nThis indicator draws three lines of different colors. The green line indicates trend up on all three time periods. The red line indicates trend down on all three time periods. The orange line means that one of the time-periods in not in agreement.

declare lower;

input price = close;
input FastHullPeriod = 20;
input SlowHullPeriod = 100;
input SuperSlowHullPeriod = 120;
input AlertEnabled = {true, default false};

def hullfast = HullMovingAvg(price, FastHullPeriod, 0);
def hullslow = HullMovingAvg(price, SlowHullPeriod, 0);
def hullsuperslow = HullMovingAvg(price, SuperSlowHullPeriod, 0);

def isUP;
def isDOWN;
def isNEUTRAL;

plot Trend = hullfast - hullslow;
plot ZeroLine = 0;

if hullfast >= hullfast[1] && hullslow >= hullslow[1] && hullsuperslow >= hullsuperslow[1] then {
    isUP = yes;
    isDOWN = no;
    isNEUTRAL = no;
} else {
    if hullfast <= hullfast[1] && hullslow <= hullslow[1] && hullsuperslow <= hullsuperslow[1] then {
        isUP = no;
        isDOWN = yes;
        isNEUTRAL = no;
    } else {
        isUP = no;
        isDOWN = no;
        isNEUTRAL = yes;
    }
}

Trend.SetDefaultColor(GetColor(1));
Trend.SetPaintingStrategy(PaintingStrategy.LINE);
Trend.SetLineWeight(2);
Trend.DefineColor("Positive", Color.GREEN);
Trend.DefineColor("Negative", Color.RED);
Trend.DefineColor("Neutral", Color.ORANGE);

Trend.AssignValueColor(if isUP then Trend.color("Positive") else if isDOWN then Trend.color("Negative") else Trend.color("Neutral") );

ZeroLine.SetDefaultColor(Color.GRAY);
ZeroLine.SetPaintingStrategy(PaintingStrategy.LINE);
ZeroLine.SetLineWeight(1);

# def condition_up = isUP == yes && isUP[1] == no && AlertEnabled;
#alert(condition_up, "MovingAverageHull3TimePeriod: Go LONG now.", Alert.BAR, Sound.NoSound);

# def condition_down = isDOWN == yes && isDOWN[1] == no && AlertEnabled;
#alert(condition_down, "MovingAverageHull3TimePeriod: Go SHORT now.", Alert.BAR, Sound.NoSound);

# def condition_neutral = isNEUTRAL == yes && isNEUTRAL[1] == no && AlertEnabled;
#alert(condition_neutral, "MovingAverageHull3TimePeriod: Turing Neutral. Close all positions now.", Alert.BAR, Sound.NoSound);
