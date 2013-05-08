#hint:<b>ATRTrailingStopCrossOver</b>\nThis indicator draws an arrow where the ATRTrailingStop crosses over the MovingAverage.

input price = open;
input trailType = {default modified, unmodified};
input ATRPeriod = 5;
input ATRFactor = 3.5;
input firstTrade = {default long, short};
input crossingType = {default above, below};
input AlertEnabled = {true, default false};

def ts;
ts = ATRTrailingStop(trailType, ATRPeriod, ATRFactor, firstTrade);

plot signal = Crossover(crossingType == CrossingType.above, price > ts);
alert(signal && AlertEnabled, "ATR Trailing Stop has just crossed over", Alert.BAR, Sound.Ding);

signal.DefineColor("Above", GetColor(6));
signal.DefineColor("Below", GetColor(7));
signal.AssignValueColor(if crossingType == CrossingType.above then signal.color("Above") else signal.color("Below"));

signal.SetPaintingStrategy(if crossingType == CrossingType.above
    then PaintingStrategy.BOOLEAN_ARROW_UP
    else PaintingStrategy.BOOLEAN_ARROW_DOWN, yes);
