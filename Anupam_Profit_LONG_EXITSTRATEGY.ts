declare LONG_EXIT;
input tradeSize = 1;
input profitTarget = 3;

def exitcondition = close > entryPrice() + profitTarget;

addOrder(exitcondition, open[-1], tradeSize);