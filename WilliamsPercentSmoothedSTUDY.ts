declare lower;

input length = 179;
input overBought = -20;
input overSold = -80;
input smoothingPeriod = 14;
input AlertEnabled = {true, default false};

plot WR = WilliamsPercentR(length, overBought, overSold);
plot WilliamsPercentSmoothed = Average(WilliamsPercentR(length, overBought, overSold), smoothingPeriod);
WilliamsPercentSmoothed.SetDefaultColor(GetColor(1));

plot Over_Sold = overSold;
Over_Sold.SetDefaultColor(GetColor(8));

plot Over_Bought = overBought;
Over_Bought.SetDefaultColor(GetColor(8));

WilliamsPercentSmoothed.DefineColor("Positive", Color.GREEN);
WilliamsPercentSmoothed.DefineColor("Negative", Color.RED);
WR.DefineColor("Positive", Color.DARK_GREEN);
WR.DefineColor("Negative", Color.DARK_RED);

WilliamsPercentSmoothed.AssignValueColor(if WilliamsPercentSmoothed > -50 then WilliamsPercentSmoothed.color("Positive") else  WilliamsPercentSmoothed.color("Negative"));
WilliamsPercentSmoothed.SetLineWeight(2);

WR.AssignValueColor(if WR > -50 then WR.color("Positive") else  WR.color("Negative"));

def WP_Hull = Average(WilliamsPercentR(length, overBought, overSold), 5);
#WP_Hull.SetDefaultColor(GetColor(2));

#WP_Hull.DefineColor("Positive", Color.GREEN);
#WP_Hull.DefineColor("Negative", Color.RED);

#WP_Hull.AssignValueColor(if WP_Hull > WP_Hull[1] then 3WP_Hull.color("Positive") else  WP_Hull.color("Negative"));
#WP_Hull.SetLineWeight(1);

# def condition_up = WilliamsPercentSmoothed > -50 && WilliamsPercentSmoothed[1] <= -50;
# alert(condition_up, "Williams %R is going UP now.", Alert.BAR, Sound.Ding);

# def condition_down = WilliamsPercentSmoothed < -50 && WilliamsPercentSmoothed[1] >= -50;
# alert(condition_down, "Williams %R is going DOWN now.", Alert.BAR, Sound.Ding);
