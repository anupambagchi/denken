input price = close;
input length = 20;
input displace = 0;

def halflength = Ceil(length / 2);
def sqrtlength = Ceil(Sqrt(length));
def val = 2 * wma(price, halflength) - wma(price, length);

plot HMA = wma(val, sqrtlength)[-displace];
HMA.SetDefaultColor(GetColor(1));

HMA.SetLineWeight(2);
HMA.DefineColor("GoingUP", Color.BLUE);
HMA.DefineColor("GoingDOWN", Color.RED);
HMA.AssignValueColor(if HMA > HMA[1] then HMA.color("GoingUP") else HMA.color("GoingDOWN"));