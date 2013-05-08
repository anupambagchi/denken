# Adjust the values for high/low comparison by creating a baseline datum at -300

declare lower; 

input cciLengthLong = 1000;
input cciAvgLengthLong = 200;
input tolerance = 0.005;

def price = open;
def linDevLong = lindev(price, cciLengthLong);
def CCILong = if linDevLong == 0 then 0 else (price - Average(price, cciLengthLong)) / linDevLong / 0.015;

def upperLevel = 300;
def lowerLevel = -300;

plot ZeroLevel = 0; 
plot CCIAvgLong = ExpAverage(ExpAverage(CCILong, cciAvgLengthLong),6);

rec baselineDatum = if CCIAvgLong > 0 then -400 else -500;

#upperLevel.SetDefaultColor(GetColor(9)); 
#lowerLevel.SetDefaultColor(GetColor(9)); 
#upperLevel.SetStyle(Curve.SHORT_DASH); 
#lowerLevel.SetStyle(Curve.SHORT_DASH); 
ZeroLevel.SetStyle(Curve.SHORT_DASH); 

CCIAvgLong.SetLineWeight(2);
CCIAvgLong.DefineColor("Positive", Color.CYAN);
CCIAvgLong.DefineColor("Negative", Color.MAGENTA);
CCIAvgLong.SetPaintingStrategy(PaintingStrategy.LINE);
CCIAvgLong.AssignValueColor(if CCIAvgLong >= CCIAvgLong[1] then CCIAvgLong.color("Positive") else CCIAvgLong.color("Negative"));

rec ppHigh;
rec pHigh;
rec cHigh;
rec ppLow;
rec pLow;
rec cLow;

if ((CCIAvgLong > CCIAvgLong[1]) && (CCIAvgLong[1] < CCIAvgLong[2])) {
    ppHigh = ppHigh[1];
    pHigh = pHigh[1];
    cHigh = cHigh[1];
    cLow = CCIAvgLong[1];
    pLow = cLow[1];
    ppLow = pLow[1];
} else {
    if ((CCIAvgLong < CCIAvgLong[1]) && (CCIAvgLong[1] > CCIAvgLong[2])) {
        cHigh = CCIAvgLong[1];
        ppHigh = pHigh[1];
        pHigh = cHigh[1];
        ppLow = ppLow[1];
        pLow = pLow[1];
        cLow = cLow[1];
    } else {
        ppHigh = ppHigh[1];
        pHigh = pHigh[1];
        cHigh = cHigh[1];
        ppLow = ppLow[1];
        pLow = pLow[1];
        cLow = cLow[1];
    }
}

rec isUp;
rec isDown;

if (cLow == CCIAvgLong[1]) {
    isUp = yes;
    isDown = no;
} else {
    if (cHigh == CCIAvgLong[1]) {
        isUp = no;
        isDown = yes;
    } else {
        isUp = no;
        isDown = no;
    }
}

plot upArrow;

if (isUp) {
    if ((cLow >= upperLevel) OR (cLow <= lowerLevel)) {
        upArrow = Double.NaN;
    } else {
        if ((cLow - baselineDatum) < (pLow - baselineDatum)*(1-tolerance)) {
            upArrow = Double.NaN;
        } else {
            upArrow = CCIAvgLong * 0.995;
        }
    }
} else {
    upArrow = Double.NaN;
}

plot downArrow;

if (isDown) {
    if ((cHigh <= lowerLevel) OR (cHigh >= upperLevel)) {
        downArrow = Double.NaN;
    } else {
        if ((cHigh-baselineDatum) > (pHigh-baselineDatum)*(1+tolerance)) {
            downArrow = Double.NaN;
        } else {
            downArrow = CCIAvgLong * 1.005;
        }
    }
} else {
    downArrow = Double.NaN;
}

#alert(signal && AlertEnabled, "ATR Trailing Stop has just crossed over", Alert.BAR, Sound.Ding);

upArrow.SetPaintingStrategy(PaintingStrategy.ARROW_UP, no);
#upArrow.DefineColor("Above", Color.GREEN);
#upArrow.DefineColor("Neutral", Color.WHITE);
upArrow.AssignValueColor(Color.GREEN);

downArrow.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN, no);
#downArrow.DefineColor("Below", Color.RED);
#downArrow.DefineColor("Neutral", Color.WHITE);
#downArrow.AssignValueColor(if downArrow <> Double.NaN then downArrow.color("Below") else downArrow.color("Neutral"));
downArrow.AssignValueColor(Color.RED);
