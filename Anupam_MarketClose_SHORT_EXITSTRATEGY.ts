declare SHORT_EXIT;
input tradeSize = 1;
input AfternoonCloseHour = 16;

def secondsSinceMidnight = secondsFromTime(0);
def closeallcondition = secondsSinceMidnight > AfternoonCloseHour * 60 * 60 and secondsSinceMidnight < (AfternoonCloseHour + 0.5) * 60 * 60;

addOrder(closeallcondition, open[-1], tradeSize);
