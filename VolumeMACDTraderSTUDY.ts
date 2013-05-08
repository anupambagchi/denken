declare lower;

input fastLength = 12;
input slowLength = 26;
input MACDLength = 9;

input VolumeFastLength = 14;
input VolumeSlowLength = 28;
input VolumeThreshold = 1000;

def fastAvg = sum(volume * close, fastLength) / sum(volume, fastLength);
def slowAvg = sum(volume * close, slowLength) / sum(volume, slowLength);
def VolumeOsc = Average(data = volume, length = VolumeFastLength) - Average(data = volume, length = VolumeSlowLength);

def Value = fastAvg - slowAvg;
def Avg = ExpAverage(Value, MACDLength);
plot Diff = Value - avg;
plot ZeroLine = 0;

Diff.SetPaintingStrategy(PaintingStrategy.LINE);
Diff.SetLineWeight(2);
Diff.DefineColor("Positive", Color.GREEN);
Diff.DefineColor("Negative", Color.RED);
Diff.DefineColor("Neutral", Color.YELLOW);

Diff.AssignValueColor(if diff > 0 and VolumeOsc > VolumeThreshold then Diff.color("Positive") else if diff < 0 and VolumeOsc > VolumeThreshold then Diff.color("Negative") else Diff.color("Neutral"));

ZeroLine.SetDefaultColor(GetColor(0));

