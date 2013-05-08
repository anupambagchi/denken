declare SHORT_EXIT;

input fastLength = 180;
input slowLength = 208;
input MACDLength = 72;
input AverageType = {SMA, default EMA};
input tradeSize = 1;

def Diff = MACD(fastLength, slowLength, MACDLength, AverageType).Diff;
def DiffFast = MACD(24, 52, 18, AverageType).Diff;

def conditionslow = Diff > Diff[1] and Diff[1] > Diff[2] and Diff[2] > Diff[3] and Diff[3] > Diff[4];
def conditionfast = DiffFast > 0;
def condition = conditionslow;

SetColor(GetColor(1));

addOrder(condition, open[-1], tradeSize);
