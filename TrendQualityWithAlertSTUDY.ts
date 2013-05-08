declare lower;

input fastLength = 7;
input slowLength = 15;
input trendLength = 4;
input noiseType = {default linear, squared};
input noiseLength = 250;
input correctionFactor = 2;
input ThresholdValue = 3;
input AlertEnabled = {true, default false};

def smf = 2 / (1 + trendLength);

def reversal = TrendPeriods(fastLength, slowLength);

rec cpc = if isNaN(reversal[1]) then 0 else if reversal[1] != reversal then 0 else cpc[1] + close - close[1];

rec trend = if isNaN(reversal[1]) then 0 else if reversal[1] != reversal then 0 else trend[1] * (1 - smf) + cpc * smf;

def noise;
def diff = AbsValue(cpc - trend);
switch(noiseType) {
case linear:
    noise = correctionFactor * Average(diff, noiseLength);
case squared:
    noise = correctionFactor * Sqrt(Average(diff*diff, noiseLength));
}

plot TQ = if noise == 0 then 0 else trend / noise;
plot ZeroLine = 0;

TQ.SetPaintingStrategy(PaintingStrategy.Histogram);
TQ.SetLineWeight(3);
TQ.DefineColor("Positive", Color.UPTICK);
TQ.DefineColor("Negative", Color.DOWNTICK);
TQ.DefineColor("Neutral", Color.YELLOW);
TQ.AssignValueColor(if TQ > ThresholdValue then TQ.color("Positive") else if TQ < -ThresholdValue then TQ.color("Negative") else TQ.color("Neutral"));
ZeroLine.SetDefaultColor(GetColor(5));

def crossthresholdup = TQ > ThresholdValue && TQ[1] <= ThresholdValue && AlertEnabled;
def crossthresholddown = TQ < -ThresholdValue && TQ[1] >= -ThresholdValue && AlertEnabled;
alert(crossthresholdup, "Trend Quality just crossed above threshold", Alert.BAR, Sound.DING); 
alert(crossthresholddown, "Trend Quality just crossed below threshold", Alert.BAR, Sound.DING); 
