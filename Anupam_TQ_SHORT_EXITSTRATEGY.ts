declare SHORT_EXIT;

input tqfastLength = 7;
input tqslowLength = 15;
input tqtrendLength = 4;
input tqnoiseType = {default linear, squared};
input tqnoiseLength = 250;
input tqcorrectionFactor = 2;
input TrendThreshold = 5;
input tradeSize = 1;

def TrendQ = TrendQuality(tqfastlength, tqslowlength, tqtrendLength, tqnoiseType, tqnoiseLength, tqcorrectionFactor);

def trendqualityfallen = TrendQ > -1 and TrendQ[1] <= -TrendThreshold and TrendQ[2] <= -TrendThreshold;

SetColor(GetColor(1));

addOrder(trendqualityfallen, open[-1], tradeSize);
