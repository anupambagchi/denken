#hint:<b>SafeDMIwithMACD</b>\nProvides the DMI trend matching it with MACD.

declare lower;

input length = 14;

input AlertEnabled = {true, default false};
input MACDFastPeriod = 12;
input MACDSlowPeriod = 26;
input MACDlength = 9;
input AverageType = {SMA, default EMA};

input trailType = {default modified, unmodified};
input ATRPeriod = 5;
input ATRFactor = 3.5;
input firstTrade = {default long, short};

input fastLength = 7;
input slowLength = 15;
input trendLength = 4;
input noiseType = {default linear, squared};
input noiseLength = 250;
input correctionFactor = 2;
input TrendThreshold = 3;

plot Trend = DMI(length)."DI+" - DMI(length)."DI-";

def Diff = MACD(MACDFastPeriod, MACDSlowPeriod, MACDLength, AverageType).Diff;
def ATRTrail = ATRTrailingStop(trailType, ATRPeriod, ATRFactor, firstTrade).TrailingStop;
def TrendQ = TrendQuality(fastlength, slowlength, trendLength, noiseType, noiseLength, correctionFactor);

def isUP;
def isDOWN;
def isNEUTRAL;
def isUPSTRONG;
def isDOWNSTRONG;

Trend.SetDefaultColor(GetColor(1));
Trend.SetPaintingStrategy(PaintingStrategy.LINE);
Trend.SetLineWeight(2);
Trend.DefineColor("Positive", Color.LIGHT_GREEN);
Trend.DefineColor("Negative", Color.PINK);
Trend.DefineColor("Neutral", Color.ORANGE);
Trend.DefineColor("StrongPositive", Color.GREEN);
Trend.DefineColor("StrongNegative", Color.RED);

if Trend > 0 && ATRTrail <= close
then {
    if TrendQ > TrendThreshold then {
       isUPSTRONG = yes;
       isUP = no;
       isDOWN = no;
       isNEUTRAL = no;
       isDOWNSTRONG = no;
    } else {
       isUPSTRONG = no;
       isUP = yes;
       isDOWN = no;
       isNEUTRAL = no;
       isDOWNSTRONG = no;
    }
} else {
    if Trend < 0 && ATRTrail >= close 
    then {
        if TrendQ < -TrendThreshold then {
           isDOWNSTRONG = yes;
           isUP = no;
           isDOWN = no;
           isNEUTRAL = no;
           isUPSTRONG = no;
        } else {
           isUPSTRONG = no;
           isDOWNSTRONG = no;
           isUP = no;
           isDOWN = yes;
           isNEUTRAL = no;
}
    } else {
        isUPSTRONG = no;
        isUP = no;
        isDOWN = no;
        isNEUTRAL = yes;
        isDOWNSTRONG = no;
    }
}


Trend.AssignValueColor(if isUP then Trend.color("Positive") else if isUPSTRONG then Trend.color("StrongPositive") else if isDOWNSTRONG then Trend.color("StrongNegative") else if isDOWN then Trend.color("Negative") else Trend.color("Neutral") );

# def condition_n = isNEUTRAL == yes && isNEUTRAL[1] == no && AlertEnabled;
#alert(condition_n, "SafeDMIwithMACD: Going Neutral. Close all positions now.", Alert.BAR, Sound.NoSound);

# def condition_u = isUP == yes && isUP[1] == no && AlertEnabled;
#alert(condition_u, "SafeDMIwithMACD: Prepare to go LONG.", Alert.BAR, Sound.NoSound);

# def condition_d = isDOWN == yes && isDOWN[1] == no && AlertEnabled;
#alert(condition_d, "SafeDMIwithMACD: Prepare to go SHORT.", Alert.BAR, Sound.NoSound);

# def condition_us = isUPSTRONG == yes && isUPSTRONG[1] == no && AlertEnabled;
#alert(condition_us, "SafeDMIwithMACD: Strong uptrend seen. Go LONG now.", Alert.BAR, Sound.NoSound);

# def condition_ds = isDOWNSTRONG == yes && isDOWNSTRONG[1] == no && AlertEnabled;
#alert(condition_ds, "SafeDMIwithMACD: Strong downtrend seen. Go SHORT now.", Alert.BAR, Sound.NoSound);
