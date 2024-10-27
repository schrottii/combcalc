// copyright don't steal blablabla

// Reset is at 24:00 (summer, +2) / / 23:00 (winter, +1)
// consider our zone

var date = new Date();
var serverDate;
var serverMidnight;
var isSummerTime = true;
var serverTimeOffset = 2;

var userTimezoneOffset = date.getTimezoneOffset() * 60000;

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "a very weird day"]; // the function this uses starts at Sunday. which is stupid.
// everyone knows that MONDAY is the first day of the week!!!
const FPS = 30;
var hourDelay = 0;

var ui = {
    textStatusGlobalChallenge: document.getElementById("textGC"),
    textCalcGlobalChallenge: document.getElementById("textCGC"),
    textCalcMoreScrap: document.getElementById("textMSC"),

    combinesLeft: document.getElementById("combinesLeft"),
    combinesRight: document.getElementById("combinesRight"),

    moreTokensLevel: document.getElementById("moreTokensLevel"),
    moreTokensLevel2: document.getElementById("moreTokensLevel2"),
    progressGlobal: document.getElementById("progressGlobal"),
    progressYours: document.getElementById("progressYours"),
    progressGlobalText: document.getElementById("progressGlobalText"),
    progressYoursText: document.getElementById("progressYoursText"),

    moreGSLevel: document.getElementById("moreGSLevel"),
    highestScrapEver: document.getElementById("highestScrapEver"),
}

ui.moreTokensLevel.oninput = () => { ui.moreTokensLevel2.value = "" }
ui.moreTokensLevel2.oninput = () => { ui.moreTokensLevel.value = "" }
ui.progressGlobal.oninput = () => { ui.progressGlobalText.innerHTML = "x" + ui.progressGlobal.value }
ui.progressYours.oninput = () => { ui.progressYoursText.innerHTML = "x" + ui.progressYours.value }
ui.progressGlobal.value = "5";
ui.progressYours.value = "5";

function updateTime() {
    date = new Date();
    serverDate = new Date(date.getTime() + userTimezoneOffset + ((serverTimeOffset - hourDelay) * 60 * 60 * 1000));
    serverMidnight = new Date(date.getTime() + userTimezoneOffset + ((2 - hourDelay) * 60 * 60 * 1000)); // for GC display

    // Germany has two timezones, Summer Time (+2) and Winter Time (+1)
    // Summer Time starts on the last Sunday in March and ends on the last Sunday in October
    // summer time if: (march and last sunday over) OR april+        AND      (october and not last sunday yet) OR november+
    isSummerTime = ((serverDate.getMonth() == 2 && serverDate.getDate() >= determineLastSundayOfMonth(2)) || serverDate.getMonth() > 2) && ((serverDate.getMonth() == 9 && serverDate.getDate() < determineLastSundayOfMonth(9)) || serverDate.getMonth() > 9);
    serverTimeOffset = isSummerTime ? 2 : 1;
}

function determineLastSundayOfMonth(monthToCheck) {
    // monthToCheck: 0 is January, 1 is February, ...
    // .getDay(): 0 is Sunday (for some stupid reason)

    let monthLength = new Date(serverDate.getYear() + 1900, monthToCheck + 1, 0).getDate(); // returns 29 in February, so counting from 1 to 29/30/31
    let dayCheck;

    for (let someDay = monthLength; someDay > 0; someDay--) {
        dayCheck = new Date(serverDate.getYear() + 1900, monthToCheck, someDay);
        if (dayCheck.getDay() == 0) return someDay;
    }

    // this piece of code should never be executed because generally there are no months without sundays but who knows
    return 0;
}

function updateGlobalChallengeTime() {
    // Status: Is Global Challenge running / when / how long

    let text = "";

    let isGC = (Math.floor((date.getTime() / 1000 / 60 / 60 + (2 - hourDelay)) / 24) - 1) % 2;
    text = "Today is " + weekdays[serverDate.getDay()] + "."
        + "<br />Today the Global Challenge is <span style='font-size:32px; color:" + (isGC ? "lightgreen" : "red") + "'>" + (isGC ? "ACTIVE!" : "INACTIVE!") + "</span>"
        + (isGC ? ("<br />It started " + serverMidnight.getHours() + " hours and " + serverMidnight.getMinutes() + " minutes ago.") :
        ("<br />It will start in " + (23 - serverMidnight.getHours()) + " hours and " + (59 - serverMidnight.getMinutes()) + " minutes."))
        + "<br /><br /><br />The server time is " + serverDate.toString().split(" GMT")[0] + " (GMT+" + serverTimeOffset + ")."
        + "<br />Reset is always at 22:00 GMT+0. (Currently " + (isSummerTime ? "0:00" : "23:00") + " for Germany/the server)";

    ui.textStatusGlobalChallenge.innerHTML = text;
}

function calculateGlobalChallenge() {
    // Calculator: How many Combine Tokens will I earn

    let combinesEarned = ui.progressGlobal.value * ui.progressYours.value;
    let combineMulti = 1;

    if (ui.moreTokensLevel.value != "") {
        combineMulti = 1 + (ui.moreTokensLevel.value / 10);
    }
    if (ui.moreTokensLevel2.value != "") {
        if (ui.moreTokensLevel2.value >= 500) combineMulti = 2 + Math.max(0, Math.floor((ui.moreTokensLevel2.value - 1000) / 1000) / 10);
        else combineMulti = 1;
    }

    combinesEarned *= combineMulti;

    ui.textCalcGlobalChallenge.innerHTML = "You will earn <big>" + Math.floor(combinesEarned) + " <img src='combineToken.png' style='width: 32px' />!</big>";

    let sidesSize = 120;

    ui.combinesLeft.style.height = "";
    ui.combinesRight.style.height = "";
    if (ui.combinesLeft.clientHeight > sidesSize) sidesSize = ui.combinesLeft.clientHeight;
    if (ui.combinesRight.clientHeight > sidesSize) sidesSize = ui.combinesRight.clientHeight;

    ui.combinesLeft.style.height = sidesSize + "px";
    ui.combinesRight.style.height = sidesSize + "px";
}

function calculateMoreScrap() {
    // Calculator: What should my More Scrap level be

    let highestScrapEver = ui.highestScrapEver.value != "" ? ui.highestScrapEver.value : 1;
    let moreGSLevel = ui.moreGSLevel.value != "" ? ui.moreGSLevel.value : 1;

    let a = Math.log10(1.4) / highestScrapEver;
    let result = ((1 / (2 * a)) * -1) + Math.sqrt(Math.pow(moreGSLevel, 2) + (moreGSLevel / 0.03) + (1 / (4 * Math.pow(a, 2))));

    ui.textCalcMoreScrap.innerHTML = "a: " + a.toFixed(6) + ". <b>Your More Scrap (Book upgrade) should be level " + Math.floor(result) + "!</b>";
}

function loop() {
    updateTime();

    // UI update
    updateGlobalChallengeTime();
    calculateGlobalChallenge();
    calculateMoreScrap();
}

console.log("onions are literally a mass torture device");
setInterval(loop, 1000 / FPS);