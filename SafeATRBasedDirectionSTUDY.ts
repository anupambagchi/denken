
#hint:<b>SafeATRBasedDirection</b>\nThis indicator draws three lines of different colors. The green line indicates safely up-trending graph and always appears up. A yellow line indicates neutral trend and is not considered safe for trading. A red line indicates safely trending down and can be used for putting short trades. It uses MACD values with different periods to arrive at this graph.

declare lower;

input AlertsEnabled = {default false, true};
input trailType = {default modified, unmodified};
input ATRPeriod = 5;
input ATRFactor = 3.5;
input firstTrade = {default long, short};

input HigherFastLength = 24;
input HigherSlowLength = 52;
input HigherMACDLength = 18;

input AverageType = {SMA, default EMA};

def ATRTrail = ATRTrailingStop(trailType, ATRPeriod, ATRFactor, firstTrade).TrailingStop;
def macd_higher1 = MACD(HigherFastLength, HigherSlowLength, HigherMACDLength, AverageType).Diff;

def isUP;
def isDOWN;
def isNEUTRAL;

plot Trend;

if ATRTrail <= close and macd_higher1 >= 0 then {
    Trend = 1;
    isUP = yes;
    isDOWN = no;
    isNEUTRAL = no;
} else {
    if ATRTrail >= close and macd_higher1 <= 0 then {
        Trend = -1;
        isUP = no;
        isDOWN = yes;
        isNEUTRAL = no;
    } else {
        Trend = 0;
        isUP = no;
        isDOWN = no;
        isNEUTRAL = yes;
    }
}

Trend.SetDefaultColor(GetColor(1));
Trend.SetPaintingStrategy(PaintingStrategy.POINTS);
Trend.SetLineWeight(1);
Trend.DefineColor("Positive", Color.GREEN);
Trend.DefineColor("Negative", Color.RED);
Trend.DefineColor("Neutral", Color.ORANGE);

Trend.AssignValueColor(if isUP then Trend.color("Positive") else if isDOWN then Trend.color("Negative") else Trend.color("Neutral") );

# def crossingup = Trend == 1 && Trend[1] != 1;
# def crossingdown = Trend == -1 && Trend[1] != -1;
# def closeposition = Trend == 0 && Trend[1] != 0;

#alert(crossingup && AlertsEnabled, "SafeATRBasedDirection: Go LONG now", Alert.BAR, Sound.DING);
#alert(crossingdown && AlertsEnabled, "SafeATRBasedDirection: Go SHORT now", Alert.BAR, Sound.DING);
#alert(closeposition && AlertsEnabled, "SafeATRBasedDirection: Close all open positions now", Alert.BAR, Sound.DING);
