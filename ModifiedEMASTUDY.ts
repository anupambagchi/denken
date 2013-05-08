declare upper;

#def length1 = 240;
#def smooth1 = 40;

def length1;
def smooth1;

#def length2 = 1200;
#def smooth2 = 120;

def length2;
def smooth2;

def shortLength;
def shortSmoothener;

def lastTurnSeparation;

input price1 = open;
input hideCyanPink = {default false, true};
input hideYellowGreen = {false, default true};
input hideBlueRed = {default false, true};
input smoothDarkGreenRedProperly = {false, default true};
input darkGreenSmoothMultiplier = 1.5;
input blueRedSmoothMultiplier = 3.0;
#input useTolerance = {default true, false};
def ignoreBarSeparation = 40;#28;
def torqueSignalSeparation = 36;

def tolerance;
def blueRedTolerance;
def greenYellowTolerance;

if (getAggregationPeriod() <= 3*AggregationPeriod.MIN) {
	tolerance = 3.0;#3.0;
	length1 = 1600;
	smooth1 = 50;
	length2 = 1100;
	smooth2 = 4;#20;
	shortLength = 350;
	shortSmoothener = 36;#12;
	blueRedTolerance = tolerance;
	greenYellowTolerance = tolerance;
	lastTurnSeparation = 640;
} else {
	if (getAggregationPeriod() <= 5*AggregationPeriod.MIN) {
		tolerance = 5.0;#6.0;
		length1 = 1600;
		smooth1 = 50;
		length2 = 1100;
		smooth2 = 3;#6;
		shortLength = 350;
		shortSmoothener = 24;#12
		blueRedTolerance = tolerance;
		greenYellowTolerance = tolerance;
		lastTurnSeparation = 504;
	} else {
		if (getAggregationPeriod() <= 10*AggregationPeriod.MIN) {
			tolerance = 8.0;#10.0;
			length1 = 1300;
			smooth1 = 25;
			length2 = 900;
			smooth2 = 4;#6;			
			shortLength = 350;
			shortSmoothener = 12;#12;
			blueRedTolerance = tolerance;
			greenYellowTolerance = tolerance;
			lastTurnSeparation = 288;
		} else {
			if (getAggregationPeriod() <= 30*AggregationPeriod.MIN) {
				tolerance = 12.0;#15.0;
				length1 = 700;
				smooth1 = 20;
				length2 = 400;
				smooth2 = 4;#6;
				shortLength = 200;
				shortSmoothener = 8;#20;
				blueRedTolerance = tolerance/2.5;
				greenYellowTolerance = tolerance/2;
				lastTurnSeparation = 288;
			} else {
				if (getAggregationPeriod() <= 60*AggregationPeriod.MIN) {
					tolerance = 20.0;#20.0;
					length1 = 1000;
					smooth1 = 20;
					length2 = 600;
					smooth2 = 4;#6;
					shortLength = 300;
					shortSmoothener = 8;#8;
					blueRedTolerance = tolerance/2.5;
					greenYellowTolerance = tolerance/2;
					lastTurnSeparation = 288;
				} else {
					tolerance = 10.0;#20.0;
					length1 = 800;
					smooth1 = 20;
					length2 = 500;
					smooth2 = 4;#20;
					shortLength = 200;
					shortSmoothener = 4;
					blueRedTolerance = tolerance/2.5;
					greenYellowTolerance = tolerance/2;
					lastTurnSeparation = 144;
				}
			}
		}	    
	}
}

#############################################################

def largesmoothener;

if (getAggregationPeriod() < 10*AggregationPeriod.MIN) {
	if (smoothDarkGreenRedProperly) {
		largesmoothener = Ceil(smooth1*darkGreenSmoothMultiplier*1.2);
	} else {
		largesmoothener = Ceil(smooth1*0.8);
	}
} else {
	if (smoothDarkGreenRedProperly) {
		largesmoothener = Ceil(smooth1*darkGreenSmoothMultiplier);
	} else {
		largesmoothener = Ceil(smooth1*0.95);
	}
}

plot ema8 = ExpAverage(ExpAverage(price1,Ceil(length1*1.5)),largesmoothener);
ema8.DefineColor("Positive", Color.DARK_GREEN);
ema8.DefineColor("Negative", Color.DARK_RED);
ema8.AssignValueColor(if ema8 > ema8[1] then ema8.color("Positive") else ema8.color("Negative"));
ema8.SetLineWeight(1);

rec ppHigh8;
rec pHigh8;
rec cHigh8;
rec ppLow8;
rec pLow8;
rec cLow8;
rec lastLowBar8;
rec lastHighBar8;
rec checkAgainstPreviousTwo8;
rec lastTurnType8;
rec lastTurnBarNumber8;

if ((ema8 > ema8[1]) && (ema8[1] < ema8[2])) {
	lastLowBar8 = barNumber();
	lastHighBar8 = lastHighBar8[1];
	ppHigh8 = ppHigh8[1];
	pHigh8 = pHigh8[1];
	cHigh8 = cHigh8[1];
	cLow8 = ema8[1];
	pLow8 = cLow8[1];
	if (lastLowBar8 - lastHighBar8 > ignoreBarSeparation) {
		checkAgainstPreviousTwo8 = no;
		ppLow8 = pLow8[1];
	} else {
		checkAgainstPreviousTwo8 = yes;
		ppLow8 = Min(pLow8[1], ppLow8[1]);
	}
	lastTurnType8 = 1;
	lastTurnBarNumber8 = barNumber();
} else {
	if ((ema8 < ema8[1]) && (ema8[1] > ema8[2])) {
		lastLowBar8 = lastLowBar8[1];
		lastHighBar8 = barNumber();
		cHigh8 = ema8[1];
		pHigh8 = cHigh8[1];
		ppLow8 = ppLow8[1];
		pLow8 = pLow8[1];
		cLow8 = cLow8[1];
		if (lastHighBar8 - lastLowBar8 > ignoreBarSeparation) {
			checkAgainstPreviousTwo8 = no;
			ppHigh8 = pHigh8[1];
		} else {
			checkAgainstPreviousTwo8 = yes;
			ppHigh8 = Max(pHigh8[1],ppHigh8[8]);
		}
		lastTurnType8 = -1;
		lastTurnBarNumber8 = barNumber();
	} else {
		lastLowBar8 = lastLowBar8[1];
		lastHighBar8 = lastHighBar8[1];
		ppHigh8 = ppHigh8[1];
		pHigh8 = pHigh8[1];
		cHigh8 = cHigh8[1];
		ppLow8 = ppLow8[1];
		pLow8 = pLow8[1];
		cLow8 = cLow8[1];
		checkAgainstPreviousTwo8 = checkAgainstPreviousTwo8[1];
		lastTurnType8 = lastTurnType8[1];
		lastTurnBarNumber8 = lastTurnBarNumber8[1];
	}
}

rec isUp8;
rec isDown8;

if ((cLow8 == ema8[1]) && (ema8 > ema8[1])) {
	isUp8 = yes;
	isDown8 = no;
} else {
	if ((cHigh8 == ema8[1]) && (ema8 < ema8[1])) {
		isUp8 = no;
		isDown8 = yes;
	} else {
		isUp8 = no;
		isDown8 = no;
	}
}

##################################################

def largesmoothener1;
if (getAggregationPeriod() <= 10*AggregationPeriod.MIN) {
	largesmoothener1 = Ceil(smooth1*blueRedSmoothMultiplier);
} else {
	largesmoothener1 = Ceil(smooth1*1);
}

plot ema7 = ExpAverage(ExpAverage(price1,length1),largesmoothener1);

ema7.DefineColor("Positive", Color.BLUE);
ema7.DefineColor("Negative", Color.RED);
ema7.AssignValueColor(if ema7 > ema7[1] then ema7.color("Positive") else ema7.color("Negative"));
ema7.SetLineWeight(1);

rec ppHigh7;
rec pHigh7;
rec cHigh7;
rec ppLow7;
rec pLow7;
rec cLow7;
rec lastLowBar7;
rec lastHighBar7;
rec checkAgainstPreviousTwo7;
rec lastTurnType7;
rec lastTurnBarNumber7;

if ((ema7 > ema7[1]) && (ema7[1] < ema7[2])) {
	lastLowBar7 = barNumber();
	lastHighBar7 = lastHighBar7[1];
	ppHigh7 = ppHigh7[1];
	pHigh7 = pHigh7[1];
	cHigh7 = cHigh7[1];
	cLow7 = ema7[1];
	pLow7 = cLow7[1];
	if (lastLowBar7 - lastHighBar7 > ignoreBarSeparation) {
		checkAgainstPreviousTwo7 = no;
		ppLow7 = pLow7[1];
	} else {
		checkAgainstPreviousTwo7 = yes;
		ppLow7 = Min(pLow7[1],ppLow7[1]);
	}
	lastTurnType7 = 1;
	lastTurnBarNumber7 = barNumber();
} else {
	if ((ema7 < ema7[1]) && (ema7[1] > ema7[2])) {
		lastLowBar7 = lastLowBar7[1];
		lastHighBar7 = barNumber();
		cHigh7 = ema7[1];
		pHigh7 = cHigh7[1];
		ppLow7 = ppLow7[1];
		pLow7 = pLow7[1];
		cLow7 = cLow7[1];
		if (lastHighBar7 - lastLowBar7 > ignoreBarSeparation) {
			checkAgainstPreviousTwo7 = no;
			ppHigh7 = pHigh7[1];
		} else {
			checkAgainstPreviousTwo7 = yes;
			ppHigh7 = Max(pHigh7[1],ppHigh7[1]);
		}
		lastTurnType7 = -1;
		lastTurnBarNumber7 = barNumber();
	} else {
		lastLowBar7 = lastLowBar7[1];
		lastHighBar7 = lastHighBar7[1];
		ppHigh7 = ppHigh7[1];
		pHigh7 = pHigh7[1];
		cHigh7 = cHigh7[1];
		ppLow7 = ppLow7[1];
		pLow7 = pLow7[1];
		cLow7 = cLow7[1];
		checkAgainstPreviousTwo7 = checkAgainstPreviousTwo7[1];
		lastTurnType7 = lastTurnType7[1];
		lastTurnBarNumber7 = lastTurnBarNumber7[1];
	}
}

rec isUp7;
rec isDown7;

if ((cLow7 == ema7[1]) && (ema7 > ema7[1])) {
	isUp7 = yes;
	isDown7 = no;
} else {
	if ((cHigh7 == ema7[1]) && (ema7 < ema7[1])) {
		isUp7 = no;
		isDown7 = yes;
	} else {
		isUp7 = no;
		isDown7 = no;
	}
}

##################################################

#plot ema6 = ExpAverage(ExpAverage(price1,length2),smooth2);

#ema6.DefineColor("Positive", Color.GREEN);
#ema6.DefineColor("Negative", Color.YELLOW);
#ema6.AssignValueColor(if ema6 > ema6[1] then ema6.color("Positive") else ema6.color("Negative"));
#ema6.SetLineWeight(1);

#rec ppHigh6;
#rec pHigh6;
#rec cHigh6;
#rec ppLow6;
#rec pLow6;
#rec cLow6;
#rec lastLowBar6;
#rec lastHighBar6;
#rec checkAgainstPreviousTwo6;
#rec lastTurnType6;
#rec lastTurnBarNumber6;

#if ((ema6 > ema6[1]) && (ema6[1] < ema6[2])) {
#	lastLowBar6 = barNumber();
#	lastHighBar6 = lastHighBar6[1];
#	ppHigh6 = ppHigh6[1];
#	pHigh6 = pHigh6[1];
#	cHigh6 = cHigh6[1];
#	cLow6 = ema6[1];
#	pLow6 = cLow6[1];
#	ppLow6 = pLow6[1];
#	if (lastLowBar6 - lastHighBar6 > ignoreBarSeparation) {
#		checkAgainstPreviousTwo6 = no;
#	} else {
#		checkAgainstPreviousTwo6 = yes;
#	}
#	lastTurnType6 = 1;
#	lastTurnBarNumber6 = barNumber();
#} else {
#	if ((ema6 < ema6[1]) && (ema6[1] > ema6[2])) {
#		lastLowBar6 = lastLowBar6[1];
#		lastHighBar6 = barNumber();
#		cHigh6 = ema6[1];
#		ppHigh6 = pHigh6[1];
#		pHigh6 = cHigh6[1];
#		ppLow6 = ppLow6[1];
#		pLow6 = pLow6[1];
#		cLow6 = cLow6[1];
#		if (lastHighBar6 - lastLowBar6 > ignoreBarSeparation) {
#			checkAgainstPreviousTwo6 = no;
#		} else {
#			checkAgainstPreviousTwo6 = yes;
#		}
#		lastTurnType6 = -1;
#		lastTurnBarNumber6 = barNumber();
#	} else {
#		lastLowBar6 = lastLowBar6[1];
#		lastHighBar6 = lastHighBar6[1];
#		ppHigh6 = ppHigh6[1];
#		pHigh6 = pHigh6[1];
#		cHigh6 = cHigh6[1];
#		ppLow6 = ppLow6[1];
#		pLow6 = pLow6[1];
#		cLow6 = cLow6[1];
#		checkAgainstPreviousTwo6 = checkAgainstPreviousTwo6[1];
#		lastTurnType6 = lastTurnType6[1];
#		lastTurnBarNumber6 = lastTurnBarNumber6[1];
#	}
#}

#rec isUp6;
#rec isDown6;

#if ((cLow6 == ema6[1]) && (ema6 > ema6[1])) {
#	isUp6 = yes;
#	isDown6 = no;
#} else {
#	if ((cHigh6 == ema6[1]) && (ema6 < ema6[1])) {
#		isUp6 = no;
#		isDown6 = yes;
#	} else {
#		isUp6 = no;
#		isDown6 = no;
#	}
#}

###############################################

plot ema5 = ExpAverage(ExpAverage(price1,shortLength),shortSmoothener);

#ema5.setStyle(Curve.SHORT_DASH);
ema5.DefineColor("Positive", Color.CYAN);
ema5.DefineColor("Negative", Color.PINK);
ema5.AssignValueColor(if ema5 > ema5[1] then ema5.color("Positive") else ema5.color("Negative"));
ema5.SetLineWeight(1);

rec ppHigh5;
rec pHigh5;
rec cHigh5;
rec ppLow5;
rec pLow5;
rec cLow5;
rec lastLowBar5;
rec lastHighBar5;
rec checkAgainstPreviousTwo5;
rec lastTurnType5;
rec lastTurnBarNumber5;
rec lastUpTurnWasShort5;
rec lastDownTurnWasShort5;

if ((ema5 > ema5[1]) && (ema5[1] < ema5[2])) {
	lastLowBar5 = barNumber();
	lastHighBar5 = lastHighBar5[1];
	ppHigh5 = ppHigh5[1];
	pHigh5 = pHigh5[1];
	cHigh5 = cHigh5[1];
	cLow5 = ema5[1];
	pLow5 = cLow5[1];
	if (lastLowBar5 - lastHighBar5 > ignoreBarSeparation) {
		lastUpTurnWasShort5 = 0;
		lastDownTurnWasShort5 = lastDownTurnWasShort5[1];
	} else {
		lastUpTurnWasShort5 = 1;
		lastDownTurnWasShort5 = lastDownTurnWasShort5[1];
	}
	if (lastLowBar5 - lastHighBar5 > ignoreBarSeparation) {
		checkAgainstPreviousTwo5 = no;
		if (lastUpTurnWasShort5[1] == 0) {
			ppLow5 = pLow5[1];
		} else {
			ppLow5 = Min(pLow5[1],ppLow5[1]);
		}
	} else {
		checkAgainstPreviousTwo5 = yes;
		ppLow5 = Min(pLow5[1],ppLow5[1]);
	}
	lastTurnType5 = 1;
	lastTurnBarNumber5 = barNumber();
} else {
	if ((ema5 < ema5[1]) && (ema5[1] > ema5[2])) {
		lastLowBar5 = lastLowBar5[1];
		lastHighBar5 = barNumber();
		cHigh5 = ema5[1];
		pHigh5 = cHigh5[1];
		ppLow5 = ppLow5[1];
		pLow5 = pLow5[1];
		cLow5 = cLow5[1];
		if (lastHighBar5 - lastLowBar5 > ignoreBarSeparation) {
			lastDownTurnWasShort5 = 0;
			lastUpTurnWasShort5 = lastUpTurnWasShort5[1];
		} else {
			lastDownTurnWasShort5 = 1;
			lastUpTurnWasShort5 = lastUpTurnWasShort5[1];
		}
		if (lastHighBar5 - lastLowBar5 > ignoreBarSeparation) {
			checkAgainstPreviousTwo5 = no;
			if (lastDownTurnWasShort5[1] == 0){
				ppHigh5 = pHigh5[1];
			} else {
				ppHigh5 = Max(pHigh5[1],ppHigh5[1]);
			}
		} else {
			checkAgainstPreviousTwo5 = yes;
			ppHigh5 = Max(pHigh5[1],ppHigh5[1]);
		}
		lastTurnType5 = -1;
		lastTurnBarNumber5 = barNumber();
	} else {
		lastLowBar5 = lastLowBar5[1];
		lastHighBar5 = lastHighBar5[1];
		ppHigh5 = ppHigh5[1];
		pHigh5 = pHigh5[1];
		cHigh5 = cHigh5[1];
		ppLow5 = ppLow5[1];
		pLow5 = pLow5[1];
		cLow5 = cLow5[1];
		checkAgainstPreviousTwo5 = checkAgainstPreviousTwo5[1];
		lastTurnType5 = lastTurnType5[1];
		lastTurnBarNumber5 = lastTurnBarNumber5[1];
		lastUpTurnWasShort5 = lastUpTurnWasShort5[1];
		lastDownTurnWasShort5 = lastDownTurnWasShort5[1];
	}
}

rec isUp5;
rec isDown5;

if ((cLow5 == ema5[1]) && (ema5 > ema5[1])) {
	isUp5 = yes;
	isDown5 = no;
} else {
	if ((cHigh5 == ema5[1]) && (ema5 < ema5[1])) {
		isUp5 = no;
		isDown5 = yes;
	} else {
		isUp5 = no;
		isDown5 = no;
	}
}

################################################################################################################################

plot upArrowMedium8;
if (isUp8) {
	if (checkAgainstPreviousTwo8[1]) {
		if ((lastTurnBarNumber8 - lastTurnBarNumber8[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber8 - lastTurnBarNumber8[1] >= lastTurnSeparation) OR		
		((cLow8*(10000 + blueRedTolerance) > pLow8*10000) OR (cLow8*(10000 + blueRedTolerance) > ppLow8*10000))) {
			upArrowMedium8 = ema8 * 0.9995;
		} else {
			upArrowMedium8 = Double.NaN;
		}
	} else {
		if ((lastTurnBarNumber8 - lastTurnBarNumber8[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber8 - lastTurnBarNumber8[1] >= lastTurnSeparation) OR		
		(cLow8*(10000 + blueRedTolerance) > pLow8*10000)) {
			upArrowMedium8 = ema8 * 0.9995;
		} else {
			upArrowMedium8 = Double.NaN;
		}
	}
} else {
	upArrowMedium8 = Double.NaN;
}

plot downArrowMedium8;
if (isDown8) {
	if (checkAgainstPreviousTwo8[1]) {
		if ((lastTurnBarNumber8 - lastTurnBarNumber8[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber8 - lastTurnBarNumber8[1] >= lastTurnSeparation) OR		
		((cHigh8*(10000 - blueRedTolerance) < pHigh8*10000) OR (cHigh8*(10000 - blueRedTolerance) < ppHigh8*10000))) {
			downArrowMedium8 = ema8* 1.0005;
		} else {
			downArrowMedium8 = Double.NaN;
		}
	} else {
		if ((lastTurnBarNumber8 - lastTurnBarNumber8[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber8 - lastTurnBarNumber8[1] >= lastTurnSeparation) OR		
		(cHigh8*(10000 - blueRedTolerance) < pHigh8*10000)) {
			downArrowMedium8 = ema8 * 1.0005;
		} else {
			downArrowMedium8 = Double.NaN;
		}
	}
} else {
	downArrowMedium8 = Double.NaN;
}

upArrowMedium8.SetPaintingStrategy(PaintingStrategy.ARROW_UP, no);
upArrowMedium8.setDefaultColor(Color.DARK_GREEN);

downArrowMedium8.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN, no);
downArrowMedium8.setDefaultColor(Color.DARK_RED);

alert((!isNaN(upArrowMedium8)), concat(open,concat(concat(" : DarkGreen Arrow Buy : ",getUnderlyingSymbol())," ")), Alert.BAR, Sound.Ring);
alert((!isNaN(downArrowMedium8)), concat(open,concat(concat(" : DarkRed Arrow Sell : ",getUnderlyingSymbol())," ")), Alert.BAR, Sound.Chimes);

##################################################

plot upArrowMedium7;
if (isUp7) {
	if (checkAgainstPreviousTwo7[1]) {
		if ((lastTurnBarNumber7 - lastTurnBarNumber7[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber7 - lastTurnBarNumber7[1] >= lastTurnSeparation) OR		
		((lastTurnBarNumber7 > lastTurnBarNumber8) && (lastTurnType8 == 1) && (lastTurnBarNumber7 - lastTurnBarNumber8 <= torqueSignalSeparation/3)) OR
		((cLow7*(10000 + blueRedTolerance) > pLow7*10000) OR (cLow7*(10000 + blueRedTolerance) > ppLow7*10000))) {
			upArrowMedium7 = ema7 * 0.9995;
		} else {
			upArrowMedium7 = Double.NaN;
		}
	} else {
		if ((lastTurnBarNumber7 - lastTurnBarNumber7[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber7 - lastTurnBarNumber7[1] >= lastTurnSeparation) OR		
		((lastTurnBarNumber7 > lastTurnBarNumber8) && (lastTurnType8 == 1) && (lastTurnBarNumber7 - lastTurnBarNumber8 <= torqueSignalSeparation/3)) OR
		(cLow7*(10000 + blueRedTolerance) > pLow7*10000)) {
			upArrowMedium7 = ema7 * 0.9995;
		} else {
			upArrowMedium7 = Double.NaN;
		}
	}
} else {
	upArrowMedium7 = Double.NaN;
}

plot downArrowMedium7;
if (isDown7) {
	if (checkAgainstPreviousTwo7[1]) {
		if ((lastTurnBarNumber7 - lastTurnBarNumber7[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber7 - lastTurnBarNumber7[1] >= lastTurnSeparation) OR		
		((lastTurnBarNumber7 > lastTurnBarNumber8) && (lastTurnType8 == -1) && (lastTurnBarNumber7 - lastTurnBarNumber8 <= torqueSignalSeparation/3)) OR
		((cHigh7*(10000 - blueRedTolerance) < pHigh7*10000) OR (cHigh7*(10000 - blueRedTolerance) < ppHigh7*10000))) {
			downArrowMedium7 = ema7* 1.0005;
		} else {
			downArrowMedium7 = Double.NaN;
		}
	} else {
		if ((lastTurnBarNumber7 - lastTurnBarNumber7[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber7 - lastTurnBarNumber7[1] >= lastTurnSeparation) OR		
		((lastTurnBarNumber7 > lastTurnBarNumber8) && (lastTurnType8 == -1) && (lastTurnBarNumber7 - lastTurnBarNumber8 <= torqueSignalSeparation/3)) OR
		(cHigh7*(10000 - blueRedTolerance) < pHigh7*10000)) {
			downArrowMedium7 = ema7 * 1.0005;
		} else {
			downArrowMedium7 = Double.NaN;
		}
	}
} else {
	downArrowMedium7 = Double.NaN;
}

upArrowMedium7.SetPaintingStrategy(PaintingStrategy.ARROW_UP, no);
upArrowMedium7.setDefaultColor(Color.BLUE);

downArrowMedium7.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN, no);
downArrowMedium7.setDefaultColor(Color.RED);

ema7.setHiding(hideBlueRed);
upArrowMedium7.setHiding(hideBlueRed);
downArrowMedium7.setHiding(hideBlueRed);

def showAlert71;
def showAlert72;

switch (hideBlueRed) {
	case true:
		showAlert71 = 0;
		showAlert72 = 0;
	case false:
		if (!isNaN(upArrowMedium7)) {
			showAlert71 = 1;
			showAlert72 = 0;
		} else {
			if (!isNaN(downArrowMedium7)) {
				showAlert71 = 0;
				showAlert72 = 1;
			} else {
				showAlert71 = 0;
				showAlert72 = 0;
			}
		}
}

alert(showAlert71, concat(open,concat(concat(" : Blue Arrow Buy : ",getUnderlyingSymbol())," ")), Alert.BAR, Sound.Ring);
alert(showAlert72, concat(open,concat(concat(" : Red Arrow Sell : ",getUnderlyingSymbol())," ")), Alert.BAR, Sound.Chimes);

##################################################

#plot upArrowMedium6;
#if (isUp6) {
#	if (checkAgainstPreviousTwo6[1]) {
#		if ((lastTurnBarNumber6 - lastTurnBarNumber6[1] <= torqueSignalSeparation) OR 
#		((cLow6*(10000 + greenYellowTolerance) >= pLow6*10000) OR (cLow6*(10000 + greenYellowTolerance) >= ppLow6*10000))) {
#			upArrowMedium6 = ema6 * 0.9995;
#		} else {
#			upArrowMedium6 = Double.NaN;
#		}
#	} else {
#		if ((lastTurnBarNumber6 - lastTurnBarNumber6[1] <= torqueSignalSeparation) OR 
#		(cLow6*(10000 + greenYellowTolerance) >= pLow6*10000)) {
#			upArrowMedium6 = ema6 * 0.9995;
#		} else {
#			upArrowMedium6 = Double.NaN;
#		}
#	}
#} else {
#	upArrowMedium6 = Double.NaN;
#}

#plot downArrowMedium6;
#if (isDown6) {
#	if (checkAgainstPreviousTwo6[1]) {
#		if ((lastTurnBarNumber6 - lastTurnBarNumber6[1] <= torqueSignalSeparation) OR 
#		((cHigh6*(10000 - greenYellowTolerance) <= pHigh6*10000) OR (cHigh6*(10000 - greenYellowTolerance) <= ppHigh6*10000))) {
#			downArrowMedium6 = ema6* 1.0005;
#		} else {
#			downArrowMedium6 = Double.NaN;
#		}
#	} else {
#		if ((lastTurnBarNumber6 - lastTurnBarNumber6[1] <= torqueSignalSeparation) OR 
#		(cHigh6*(10000 - greenYellowTolerance) <= pHigh6*10000)) {
#			downArrowMedium6 = ema6 * 1.0005;
#		} else {
#			downArrowMedium6 = Double.NaN;
#		}
#	}
#} else {
#	downArrowMedium6 = Double.NaN;
#}

#upArrowMedium6.SetPaintingStrategy(PaintingStrategy.ARROW_UP, no);
#upArrowMedium6.setDefaultColor(Color.GREEN);

#downArrowMedium6.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN, no);
#downArrowMedium6.setDefaultColor(Color.YELLOW);

#ema6.setHiding(hideYellowGreen);
#upArrowMedium6.setHiding(hideYellowGreen);
#downArrowMedium6.setHiding(hideYellowGreen);

#def showAlert61;
#def showAlert62;

#switch (hideYellowGreen) {
#	case true:
#		showAlert61 = 0;
#		showAlert62 = 0;
#	case false:
#		if (!isNaN(upArrowMedium6)) {
#			showAlert61 = 1;
#			showAlert62 = 0;
#		} else {
#			if (!isNaN(downArrowMedium6)) {
#				showAlert61 = 0;
#				showAlert62 = 1;
#			} else {
#				showAlert61 = 0;
#				showAlert62 = 0;
#			}
#		}
#}

#alert(showAlert61, concat(open,concat(concat(" : Green Arrow Buy : ",getUnderlyingSymbol())," ")), Alert.BAR, Sound.Ring);
#alert(showAlert62, concat(open,concat(concat(" : Yellow Arrow Sell : ",getUnderlyingSymbol())," ")), Alert.BAR, Sound.Chimes);

###############################################

plot upArrowMedium5;
if (isUp5) {
	if (checkAgainstPreviousTwo5[1]) {
		if ((lastTurnBarNumber5 - lastTurnBarNumber5[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber5 - lastTurnBarNumber5[1] >= lastTurnSeparation) OR
		(((cLow5*(10000 + tolerance) > pLow5*10000) OR (cLow5*(10000 + tolerance) > ppLow5*10000)))) {
			upArrowMedium5 = ema5 * 0.9995;
		} else {
			upArrowMedium5 = Double.NaN;
		}
	} else {
		if ((lastTurnBarNumber5 - lastTurnBarNumber5[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber5 - lastTurnBarNumber5[1] >= lastTurnSeparation) OR
		((cLow5*(10000 + tolerance) > pLow5*10000))) {
			upArrowMedium5 = ema5 * 0.9995;
		} else {
			upArrowMedium5 = Double.NaN;
		}
	}

} else {
	upArrowMedium5 = Double.NaN;
}

plot downArrowMedium5;
if (isDown5) {
	if (checkAgainstPreviousTwo5[1]) {
		if ((lastTurnBarNumber5 - lastTurnBarNumber5[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber5 - lastTurnBarNumber5[1] >= lastTurnSeparation) OR
		(((cHigh5*(10000 - tolerance) < pHigh5*10000) OR (cHigh5*(10000 - tolerance) < ppHigh5*10000)))) {
			downArrowMedium5 = ema5 * 1.0005;
		} else {
			downArrowMedium5 = Double.NaN;
		}
	} else {
		if ((lastTurnBarNumber5 - lastTurnBarNumber5[1] <= torqueSignalSeparation) OR 
		(lastTurnBarNumber5 - lastTurnBarNumber5[1] >= lastTurnSeparation) OR
		((cHigh5*(10000 - tolerance) < pHigh5*10000))) {
			downArrowMedium5 = ema5 * 1.0005;
		} else {
			downArrowMedium5 = Double.NaN;
		}
	}
} else {
	downArrowMedium5 = Double.NaN;
}

upArrowMedium5.SetPaintingStrategy(PaintingStrategy.ARROW_UP, no);
upArrowMedium5.setDefaultColor(Color.CYAN);

downArrowMedium5.SetPaintingStrategy(PaintingStrategy.ARROW_DOWN, no);
downArrowMedium5.setDefaultColor(Color.PINK);

ema5.setHiding(hideCyanPink);
upArrowMedium5.setHiding(hideCyanPink);
downArrowMedium5.setHiding(hideCyanPink);

def showAlert51;
def showAlert52;

switch (hideCyanPink) {
	case true:
		showAlert51 = 0;
		showAlert52 = 0;
	case false:
		if !isNaN(upArrowMedium5) {
			showAlert51 = 1;
			showAlert52 = 0;
		} else {
			if !isNaN(downArrowMedium5) {
				showAlert51 = 0;
				showAlert52 = 1;
			} else {
				showAlert51 = 0;
				showAlert52 = 0;
			}
		}
}

alert(showAlert51, concat(open,concat(concat(" : Cyan Arrow Buy : ",getUnderlyingSymbol())," ")), Alert.BAR, Sound.Ring);
alert(showAlert52, concat(open,concat(concat(" : Pink Arrow Sell : ",getUnderlyingSymbol())," ")), Alert.BAR, Sound.Chimes);

############################################################
