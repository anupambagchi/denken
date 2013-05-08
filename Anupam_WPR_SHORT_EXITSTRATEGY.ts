declare SHORT_EXIT;

input length = 79;
input overBought = -20;
input overSold = -80;
input tradeSize = 1;

def WPR = WilliamsPercentR(length, overBought, overSold);
def CrossUp = WPR > overBought && WPR[1] <= overBought;

SetColor(GetColor(1));

addOrder(CrossUp, close, tradeSize);
