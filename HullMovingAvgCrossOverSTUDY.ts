#
# thinkorswim, inc. (c) 2009
#

input price = close;
input length1 = 20;
input length2 = 100;
input crossingType = {default above, below};

def avg1;
avg1 = HullMovingAvg(price, length1, 0);

def avg2;
avg2 = HullMovingAvg(price, length2, 0);

plot signal = Crossover(crossingType == CrossingType.above, avg1 > avg2);

signal.DefineColor("Above", GetColor(6));
signal.DefineColor("Below", GetColor(7));
signal.AssignValueColor(if crossingType == CrossingType.above then signal.color("Above") else signal.color("Below"));

signal.SetPaintingStrategy(if crossingType == CrossingType.above
    then PaintingStrategy.BOOLEAN_ARROW_UP
    else PaintingStrategy.BOOLEAN_ARROW_DOWN, yes);