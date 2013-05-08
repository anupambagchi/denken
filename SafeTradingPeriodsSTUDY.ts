#hint:<b>SafeTradingPeriods</b>\nThis indicator draws three lines of different colors. The green line indicates safely up-trending graph and always appears up. A yellow line indicates neutral trend and is not considered safe for trading. A red line indicates safely trending down and can be used for putting short trades. It does the calculation based on the HullMovingAverage indicator.

declare lower;

input price = close;
input FastHullPeriod = 100;
input SlowHullPeriod = 200;
input SuperSlowHullPeriod = 220;
input AlertsEnabled = {true, default false};

def hullfast = HullMovingAvg(price, FastHullPeriod, 0);
def hullslow = HullMovingAvg(price, SlowHullPeriod, 0);
def hullsuperslow = HullMovingAvg(price, SuperSlowHullPeriod, 0);

def isUP;
def isDOWN;
def isNEUTRAL;

plot Trend = hullfast - hullslow;
def LargerTrend = hullslow - hullsuperslow;
plot ZeroLine = 0;
plot Shaded = Trend;

if hullfast >= hullfast[1] && Trend >= Trend[1] && LargerTrend >= LargerTrend[1] then {
    isUP = yes;
    isDOWN = no;
    isNEUTRAL = no;
} else {
    if hullfast <= hullfast[1] && Trend <= Trend[1] && LargerTrend <= LargerTrend[1] then {
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

Shaded.SetDefaultColor(GetColor(1));
Shaded.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Shaded.SetLineWeight(1);
Shaded.DefineColor("Positive", Color.GREEN);
Shaded.DefineColor("Negative", Color.RED);

# def condition1 = Crossover(yes, Shaded > 0) && AlertsEnabled;
#alert(condition1, "SafeTradingPeriods: Crossing UP now. Go long!", Alert.BAR, Sound.Ding);

# def condition2 = Crossover(yes, Shaded < 0) && AlertsEnabled;
#alert(condition2, "SafeTradingPeriods: Crossing DOWN now. Go short!", Alert.BAR, Sound.Ding);

# def condition3 = isUP == yes && isUP[1] == no && AlertsEnabled;
#alert(condition3, "SafeTradingPeriods: Color just changed to GREEN, prepare to go LONG!", Alert.BAR, Sound.Ding);

# def condition4 = isDOWN == yes && isDOWN[1] == no && AlertsEnabled;
#alert(condition4, "SafeTradingPeriods: Color just changed to RED, prepare to go SHORT!", Alert.BAR, Sound.Ding);

# def condition5 = isNEUTRAL == yes && isNEUTRAL[1] == no && AlertsEnabled;
#alert(condition5, "SafeTradingPeriods: Color just changed to Neutral, close any open trades", Alert.BAR, Sound.Ding);

Shaded.AssignValueColor(if isUP and Shaded > 0 then Shaded.color("Positive") else if isDOWN and Shaded < 0 then Shaded.color("Negative") else Color.WHITE);

Trend.AssignValueColor(if isUP then Trend.color("Positive") else if isDOWN then Trend.color("Negative") else Trend.color("Neutral") );

ZeroLine.SetDefaultColor(Color.GRAY);
ZeroLine.SetPaintingStrategy(PaintingStrategy.LINE);
ZeroLine.SetLineWeight(1);
