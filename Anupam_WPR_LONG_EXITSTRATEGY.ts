declare LONG_EXIT;

input length = 79;
input overBought = -20;
input overSold = -80;
input tradeSize = 1;

def WPR = WilliamsPercentR(length, overBought, overSold);
def CrossDown = WPR < overSold && WPR[1] >= overSold;

SetColor(GetColor(1));

addOrder(CrossDown, close, tradeSize);
