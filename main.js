// copyright don't steal blablabla

// Reset is at 24:00 (summer, +2) / / 23:00 (winter, +1)
// consider our zone

var date = new Date();
var serverDate;
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
    serverDate = new Date(date.getTime() + userTimezoneOffset + ((2 - hourDelay) * 60 * 60 * 1000));
    // ^change 2 to play with the timezone, +2 is server timezone

    isSummerTime = serverDate.getMonth() >= 3 && serverDate.getMonth() < 10;
    serverTimeOffset = isSummerTime ? 2 : 1;

    // ignore this:
    //now = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours() + 2, date.getUTCMinutes(), date.getUTCSeconds()));
    // this instead of new date to account for +2 time zone
}

function updateGlobalChallengeTime() {
    // Status: Is Global Challenge running / when / how long

    let text = "";

    let isGC = (Math.floor((date.getTime() / 1000 / 60 / 60 + (2 - hourDelay)) / 24) - 1) % 2;
    text = "Today is " + weekdays[serverDate.getDay()] + "."
        + "<br />Today the Global Challenge is <span style='font-size:32px; color:" + (isGC ? "lightgreen" : "red") + "'>" + (isGC ? "ACTIVE!" : "INACTIVE!") + "</span>"
        + (isGC ? ("<br />It started " + serverDate.getHours() + " hours and " + serverDate.getMinutes() + " minutes ago.") :
        ("<br />It will start in " + (23 - serverDate.getHours()) + " hours and " + (59 - serverDate.getMinutes()) + " minutes."))
        + "<br /><br /><br />The server time is " + serverDate.toString().split(" GMT")[0] + " (GMT+" + serverTimeOffset + ")."
        + "<br />Reset is always at 22:00 GMT+0. (Currently " + (isSummerTime ? "midnight" : "11 P.M.") + " for Germany/the server)";

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