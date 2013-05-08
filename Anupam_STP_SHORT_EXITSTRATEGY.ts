declare SHORT_EXIT;

input price = open;
input FastHullPeriod = 100;
input SlowHullPeriod = 200;
input SuperSlowHullPeriod = 220;
input tradeSize = 1;

def hullfast = HullMovingAvg(price, FastHullPeriod, 0);
def hullslow = HullMovingAvg(price, SlowHullPeriod, 0);
def hullsuperslow = HullMovingAvg(price, SuperSlowHullPeriod, 0);

def isUP;
def isDOWN;
def isNEUTRAL;

def Trend = hullfast - hullslow;
def LargerTrend = hullslow - hullsuperslow;

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

def PrepareUp = isUP == yes && isUP[1] == no;
def PrepareDown = isDOWN == yes && isDOWN[1] == no;
def CrossUp = Crossover(yes, Trend > 0);
def CrossDown = Crossover(yes, Trend < 0);
def GotNeutral = isNEUTRAL == yes && isNEUTRAL[1] == no;

SetColor(GetColor(1));

addOrder(GotNeutral, open[-1], tradeSize);
