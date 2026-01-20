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

var currentVersion = "v1.5.2";
var currentVersionDate = "(2026-01-20)";
var patchNotes = `
- More Scrap Calc: implemented new (complex) formula for a, requiring More Scrap upgrade level
- Updated Info and Contact sections at the bottom, including easier-to-read formatting and Balnoom brand name
- Changed purpose from "tool for Global Challenge/Combine Tokens and more" to "collection of various Scrap calcs and tools"
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
    ui.bottom.currentVersion.innerHTML = currentVersion + " " + currentVersionDate;
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
        progressYoursText: document.getElementById("progressYoursText")
    },
    moreScrapCalc: {
        statusText: document.getElementById("textMSC"),
        moreGSLevel: document.getElementById("moreGSLevel"),
        moreScrapLevel: document.getElementById("moreScrapLevel"),
        highestScrapEver: document.getElementById("highestScrapEver")
    },
    tokenCostCalc: {
        statusText: document.getElementById("textTCC"),
        selectedAd1: document.getElementById("combination1-select"),
        selectedAd2: document.getElementById("combination2-select"),
        tokenCostAmountOfAds: document.getElementById("tokenCostAmountOfAds"),
        tokenCostAmountOfTokens: document.getElementById("tokenCostAmountOfTokens")
    },
    barrelProductionCalc: {
        statusText: document.getElementById("textBPC"),
        productionBarrelOne: document.getElementById("bpcFirstProd"),
        barrelNumber: document.getElementById("bpcBarrelNr")
    },
    achievementBoostCalc: {
        statusText: document.getElementById("textABC"),
        start: document.getElementById("abcStart"),
        goal: document.getElementById("abcGoal"),
        //achievements: document.getElementById("abcAchievements")
    },
    abstractCalc: {
        statusText: document.getElementById("textAbstract"),
        input: document.getElementById("inputAbstract"),
    },
    bottom: {
        header: document.getElementById("header"),
        patchNotes: document.getElementById("patchNotes"),
        currentVersion: document.getElementById("currentVersion")
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

// LOOP
function loop() {
    updateTime();

    // UI update
    calculateGlobalChallengeTime();
    calculateGlobalChallenge();
    calculateMoreScrap();
    calculateTokenCosts();
    calculateBarrelProduction();
    calculateAchievementBoost();
}

function init() {
    ui.bottom.header.innerHTML = "CombCalc " + currentVersion;
    updatePatchNotes();

    setInterval(loop, 1000 / FPS);
}

init();