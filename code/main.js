// copyright don't steal blablabla

// Reset is at 24:00 (summer, +2) / / 23:00 (winter, +1)
// consider our zone
var date = new Date();
var serverDate;
var serverMidnight;
var isSummerTime = true;
var serverTimeOffset = 2;
var userTimezoneOffset = date.getTimezoneOffset() * 60000;
var hourDelay = 0;

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "a very weird day"]; // the function this uses starts at Sunday. which is stupid.
// everyone knows that MONDAY is the first day of the week!!!

const FPS = 15;

var currentVersion = "v1.4.1";
var patchNotes = `
- Added more invalid input texts (when you enter something illegal)
- Added some placeholder texts (gray) to indicate what you are meant to enter
- Fixed Summer time issue
- Minor improvements
`;

function updatePatchNotes() {
    let render = "";
    let currentPatchNotes = patchNotes.split("\n");
    currentPatchNotes.shift();

    render = "<h3>" + " Version " + currentVersion + "</h3>";
    for (let pn in currentPatchNotes) {
        render = render + currentPatchNotes[pn] + "<br />";
    }

    ui.bottom.patchNotes.innerHTML = render;
}

// UI DICT
var ui = {
    globalChallengeStatus: {
        statusText: document.getElementById("textGC"),
    },
    combineGainCalc: {
        statusText: document.getElementById("textCGC"),
        combinesLeft: document.getElementById("combinesLeft"),
        combinesRight: document.getElementById("combinesRight"),
        moreTokensLevel: document.getElementById("moreTokensLevel"),
        moreTokensLevel2: document.getElementById("moreTokensLevel2"),
        progressGlobal: document.getElementById("progressGlobal"),
        progressYours: document.getElementById("progressYours"),
        progressGlobalText: document.getElementById("progressGlobalText"),
        progressYoursText: document.getElementById("progressYoursText"),
    },
    moreScrapCalc: {
        statusText: document.getElementById("textMSC"),
        moreGSLevel: document.getElementById("moreGSLevel"),
        highestScrapEver: document.getElementById("highestScrapEver"),
    },
    tokenCostCalc: {
        statusText: document.getElementById("textTCC"),
        selectedAd1: document.getElementById("combination1-select"),
        selectedAd2: document.getElementById("combination2-select"),
        tokenCostAmountOfAds: document.getElementById("tokenCostAmountOfAds"),
        tokenCostAmountOfTokens: document.getElementById("tokenCostAmountOfTokens"),
    },
    barrelProductionCalc: {
        statusText: document.getElementById("textBPC"),
        productionBarrelOne: document.getElementById("bpcFirstProd"),
        barrelNumber: document.getElementById("bpcBarrelNr"),
    },
    bottom: {
        header: document.getElementById("header"),
        patchNotes: document.getElementById("patchNotes"),
    }
}

// Set some inputs
ui.combineGainCalc.moreTokensLevel.oninput = () => { ui.combineGainCalc.moreTokensLevel2.value = "" }
ui.combineGainCalc.moreTokensLevel2.oninput = () => { ui.combineGainCalc.moreTokensLevel.value = "" }
ui.combineGainCalc.progressGlobal.oninput = () => { ui.combineGainCalc.progressGlobalText.innerHTML = "x" + ui.combineGainCalc.progressGlobal.value }
ui.combineGainCalc.progressYours.oninput = () => { ui.combineGainCalc.progressYoursText.innerHTML = "x" + ui.combineGainCalc.progressYours.value }
ui.combineGainCalc.progressGlobal.value = "5";
ui.combineGainCalc.progressYours.value = "5";

// globalChallengeStatus: Time functions
function updateTime() {
    date = new Date();
    serverDate = new Date(date.getTime() + userTimezoneOffset + ((serverTimeOffset - hourDelay) * 60 * 60 * 1000));
    serverMidnight = new Date(date.getTime() + userTimezoneOffset + ((2 - hourDelay) * 60 * 60 * 1000)); // for GC display

    // Germany has two timezones, Summer Time (+2) and Winter Time (+1)
    // Summer Time starts on the last Sunday in March and ends on the last Sunday in October
    // summer time if: (march and last sunday over) OR april+        AND      (october and not last sunday yet) OR pre-October
    isSummerTime = ((serverDate.getMonth() == 2 && serverDate.getDate() >= determineLastSundayOfMonth(2)) || serverDate.getMonth() > 2)
                && ((serverDate.getMonth() == 9 && serverDate.getDate() < determineLastSundayOfMonth(9)) || serverDate.getMonth() < 9);
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

    ui.globalChallengeStatus.statusText.innerHTML = text;
}

// combineGainCalc
function calculateGlobalChallenge() {
    // Calculator: How many Combine Tokens will I earn

    let combinesEarned = ui.combineGainCalc.progressGlobal.value * ui.combineGainCalc.progressYours.value;
    let combineMulti = 1;

    if (ui.combineGainCalc.moreTokensLevel.value != "") {
        combineMulti = 1 + (ui.combineGainCalc.moreTokensLevel.value / 10);
    }
    if (ui.combineGainCalc.moreTokensLevel2.value != "") {
        if (ui.combineGainCalc.moreTokensLevel2.value >= 500) combineMulti = 2 + Math.max(0, Math.floor((ui.combineGainCalc.moreTokensLevel2.value - 1000) / 1000) / 10);
        else combineMulti = 1;
    }

    combinesEarned *= combineMulti;

    ui.combineGainCalc.statusText.innerHTML = "You will earn <big>" + Math.floor(combinesEarned) + " <img src='images/combineToken.png' style='width: 32px' />!</big>";

    let sidesSize = 120;

    ui.combineGainCalc.combinesLeft.style.height = "";
    ui.combineGainCalc.combinesRight.style.height = "";
    if (ui.combineGainCalc.combinesLeft.clientHeight > sidesSize) sidesSize = ui.combineGainCalc.combinesLeft.clientHeight;
    if (ui.combineGainCalc.combinesRight.clientHeight > sidesSize) sidesSize = ui.combineGainCalc.combinesRight.clientHeight;

    ui.combineGainCalc.combinesLeft.style.height = sidesSize + "px";
    ui.combineGainCalc.combinesRight.style.height = sidesSize + "px";
}

// moreScrapCalc
function calculateMoreScrap() {
    // Calculator: What should my More Scrap level be

    let highestScrapEver = ui.moreScrapCalc.highestScrapEver.value != "" ? ui.moreScrapCalc.highestScrapEver.value : -1;
    let moreGSLevel = ui.moreScrapCalc.moreGSLevel.value != "" ? ui.moreScrapCalc.moreGSLevel.value : -1;

    let a = Math.log10(1.4) / highestScrapEver;
    let result = ((1 / (2 * a)) * -1) + Math.sqrt(Math.pow(moreGSLevel, 2) + (moreGSLevel / 0.03) + (1 / (4 * Math.pow(a, 2))));

    if (highestScrapEver == -1 || moreGSLevel == -1) ui.moreScrapCalc.statusText.innerHTML = "Please enter your numbers";
    else ui.moreScrapCalc.statusText.innerHTML = "a: " + a.toFixed(6) + ". <b>Your More Scrap (Book upgrade) should be level " + Math.floor(result) + "!</b>";
}

// tokenCostCalc
var adNames = ["automerge", "bricks", "moremagnets", "morescrap", "fasterbarrels", "flu", "morefragments"];
const adCosts = {
    "automerge":     [0, 1, 5, 1, 12, 8, 1],
    "bricks":        [1, 0, 1, 1, 1, 1, 1],
    "moremagnets":   [5, 1, 0, 1, 8, 5, 1],
    "morescrap":     [1, 1, 1, 0, 1, 1, 1],
    "fasterbarrels": [12, 1, 8, 1, 0, 8, 5],
    "flu":           [8, 1, 5, 1, 8, 0, 1],
    "morefragments": [1, 1, 1, 1, 5, 1, 0]
}

function calculateTokenCosts() {
    let costs = 0;
    let ad1 = ui.tokenCostCalc.selectedAd1.value;
    let ad2 = ui.tokenCostCalc.selectedAd2.value;

    if (ad1 == "none" || ad2 == "none") {
        // one of the two ads is not selected
        ui.tokenCostCalc.statusText.innerHTML = "(Select the two ads you want to combine!)";
    }
    else if (ad1 == ad2) {
        // you want x100 barrels huh?!
        ui.tokenCostCalc.statusText.innerHTML = "(Don't select the same boost twice)";
    }
    else {
        // both ARE selected
        costs = adCosts[ad1][adNames.indexOf(ad2)];

        if (ui.tokenCostCalc.tokenCostAmountOfTokens.value != 0) {
            let times = Math.floor(ui.tokenCostCalc.tokenCostAmountOfTokens.value / costs);
            costs = costs * times;
            ui.tokenCostCalc.statusText.innerHTML = times + " Times (" + costs + " Token" + + (costs > 1 ? "s" : "") + ")";
        }
        else {
            costs *= ui.tokenCostCalc.tokenCostAmountOfAds.value;
            ui.tokenCostCalc.statusText.innerHTML = costs + " Token" + (costs > 1 ? "s" : "");
        }
    }
}

// barrelProductionCalc
function calculateBarrelProduction() {
    let baseProd = ui.barrelProductionCalc.productionBarrelOne.value; // received as a string
    try {
        baseProd = new Decimal(baseProd);
    }
    catch {
        ui.barrelProductionCalc.statusText.innerHTML = "Wrong format! Do it like this: 1.567e102 or 1 or 1.749e400";
        // alert("Wrong format! Do it like this: 1.567e102 or 1 or 1.749e400");
        return false;
    }

    let barrelnr = ui.barrelProductionCalc.barrelNumber.value;

    // 3 ^ barrel x base
    let result = new Decimal(3).pow(barrelnr - 1).mul(baseProd);
    result = result.mantissa.toString().substr(0, 5) + "e" + result.exponent.toString();

    if (barrelnr == "" || barrelnr < 1) ui.barrelProductionCalc.statusText.innerHTML = "That is not a real barrel!";
    else if (baseProd.eq(1)) ui.barrelProductionCalc.statusText.innerHTML = "Barrel " + barrelnr + "'s base production is " + result + " Scrap/s.";
    else ui.barrelProductionCalc.statusText.innerHTML = "Your barrel " + barrelnr + " should produce " + result + " Scrap/s.";
}

// LOOP
function loop() {
    updateTime();

    updatePatchNotes();

    // UI update
    updateGlobalChallengeTime();
    calculateGlobalChallenge();
    calculateMoreScrap();
    calculateTokenCosts();
    calculateBarrelProduction();
}

ui.bottom.header.innerHTML = "CombCalc " + currentVersion;
setInterval(loop, 1000 / FPS);