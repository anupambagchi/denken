declare SHORT_ENTRY;

input price = open;
input FastHullPeriod = 100;
input SlowHullPeriod = 200;
input SuperSlowHullPeriod = 220;
input EntryTime = {default Early, Late};
input tradeSize = 1;

def MorningOpenHour = 9;
def MorningCloseHour = 12.5;
def AfternoonOpenHour = 13.5;
def AfternoonCloseHour = 16;

def secondsSinceMidnight = secondsFromTime(0);
def safetimemorning = secondsSinceMidnight > MorningOpenHour * 60 * 60 and  secondsSinceMidnight < MorningCloseHour * 60 * 60;
def safetimeafternoon = secondsSinceMidnight > AfternoonOpenHour * 60 * 60 and secondsSinceMidnight < AfternoonCloseHour * 60 * 60;
def safetime = safetimemorning or safetimeafternoon;

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

SetColor(GetColor(1));

def EntryCondition;

switch (EntryTime) {
case Early:
  EntryCondition = PrepareDown;
case Late:
  EntryCondition = CrossDown;
} 

addOrder(EntryCondition and safetime, open[-1], tradeSize);
alert(EntryCondition and safetime, "STP Short Entry.", Alert.BAR, Sound.NoSound);

