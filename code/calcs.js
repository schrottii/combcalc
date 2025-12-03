/* --------------------------------
 *   COMBINE GAIN CALC
 * ----------------------------- */

function calculateGlobalChallengeTime() {
    // Status: Is Global Challenge running / when / how long

    let text = "";

    let isGC = (Math.floor((date.getTime() / 1000 / 60 / 60 + (2 - hourDelay)) / 24) - 1) % 2;
    text = "Today is " + weekdays[serverDate.getDay()] + "."
        + "<br />Today the Global Challenge is <span style='font-size:32px; color:" + (isGC ? "lightgreen" : "red") + "'>" + (isGC ? "ACTIVE!" : "INACTIVE!") + "</span>"
        + (isGC ? ("<br />It started " + serverMidnight.getHours() + " hours and " + serverMidnight.getMinutes() + " minutes ago.") :
            ("<br />It will start in " + (23 - serverMidnight.getHours()) + " hours and " + (59 - serverMidnight.getMinutes()) + " minutes."))
        + "<br /><br />The server time is " + serverDate.toString().split(" GMT")[0] + " (GMT+" + serverTimeOffset + ")."
        + "<br />Reset is always at 22:00 GMT+0. (Currently " + (isSummerTime ? "0:00" : "23:00") + " for Germany/the server)";

    ui.globalChallengeStatus.statusText.innerHTML = text;
}

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

/* --------------------------------
 *   MORE SCRAP CALC
 * ----------------------------- */

function calculateMoreScrap() {
    // Calculator: What should my More Scrap level be

    let highestScrapEver = ui.moreScrapCalc.highestScrapEver.value != "" ? new Decimal(ui.moreScrapCalc.highestScrapEver.value) : -1;
    let moreGSLevel = ui.moreScrapCalc.moreGSLevel.value != "" ? ui.moreScrapCalc.moreGSLevel.value : -1;
    if (highestScrapEver == -1 || moreGSLevel == -1) {
        ui.moreScrapCalc.statusText.innerHTML = "Please enter your numbers";
        return false;
    }
    if (highestScrapEver.toString().includes("e")) highestScrapEver = new Decimal(highestScrapEver);
    else highestScrapEver = new Decimal("1e" + highestScrapEver);

    let a = Math.log10(1.4) / highestScrapEver.log(10);
    let result = ((1 / (2 * a)) * -1) + Math.sqrt(Math.pow(moreGSLevel, 2) + (moreGSLevel / 0.03) + (1 / (4 * Math.pow(a, 2))));

    ui.moreScrapCalc.statusText.innerHTML = "a: " + a.toFixed(6) + ". <b>Your More Scrap (Book upgrade) should be level " + Math.floor(result) + "!</b>";
}

/* --------------------------------
 *   TOKEN COST CALC
 * ----------------------------- */

var adNames = ["automerge", "bricks", "moremagnets", "morescrap", "fasterbarrels", "flu", "morefragments"];
const adCosts = {
    "automerge": [0, 1, 5, 1, 12, 8, 1],
    "bricks": [1, 0, 1, 1, 1, 1, 1],
    "moremagnets": [5, 1, 0, 1, 8, 5, 1],
    "morescrap": [1, 1, 1, 0, 1, 1, 1],
    "fasterbarrels": [12, 1, 8, 1, 0, 8, 5],
    "flu": [8, 1, 5, 1, 8, 0, 1],
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

        if (ui.tokenCostCalc.tokenCostAmountOfTokens.value != "0") {
            // how many tokens to spend
            let times = Math.floor(ui.tokenCostCalc.tokenCostAmountOfTokens.value / costs);
            costs = costs * times;
            ui.tokenCostCalc.statusText.innerHTML = times + " Times (" + costs + " Token" + (costs > 1 ? "s" : "") + ")";
        }
        else {
            // how many times to combine
            costs *= ui.tokenCostCalc.tokenCostAmountOfAds.value;
            ui.tokenCostCalc.statusText.innerHTML = costs + " Token" + (costs > 1 ? "s" : "");
        }
    }
}

/* --------------------------------
 *   BARREL PRODUCTION CALC
 * ----------------------------- */

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

/* --------------------------------
 *   ACHIEVEMENT BOOST CALC
 * ----------------------------- */

function calculateAchievementBoost() {
    let levelDiff = parseInt(ui.achievementBoostCalc.goal.value) - parseInt(ui.achievementBoostCalc.start.value);

    if (levelDiff > 0) {
        let crystals = 0;
        for (let l = parseInt(ui.achievementBoostCalc.start.value); l < parseInt(ui.achievementBoostCalc.goal.value); l++) {
            crystals += l - 49;
        }

        ui.achievementBoostCalc.statusText.innerHTML = levelDiff + " level" + (levelDiff > 1 ? "s" : "") + ", " + crystals + " Crystal" + (crystals > 1 ? "s" : "");
    }
    else {
        ui.achievementBoostCalc.statusText.innerHTML = "Invalid levels!";
    }
}

/* --------------------------------
 *   ABSTRACT CALC
 * ----------------------------- */

var letters = "abcdefghijklmnopqrstuvwxyz";
var lettersBase = letters.length;
function calculateAbstract() {
    let x = ui.abstractCalc.input.value;
    let digits = [];
    if (x.includes("1e")) x = x.substr(2);

    if (isNaN(parseInt(x))) {
        // abstract to scientific
        let y = x.split("").reverse();
        let value;
        let place = 0;
        let digitsSum = 0;

        for (let character in y) {
            value = parseInt(letters.indexOf(y[character])) + 1;
            digits.push(value * Math.pow(lettersBase, place));
            digitsSum += value * Math.pow(lettersBase, place);
            place += 1;
        }
        ui.abstractCalc.statusText.innerHTML = "1 " + x + " in abstract notation is 1e" + (3 * digitsSum + 3) + " in scientific notation";
    }
    else if (typeof (parseInt(x)) == "number") {
        // scientific to abstract
        x = parseInt(x);
        let y = Math.floor((x - 3) / 3);
        let digitsResult = "";

        while (y > 0) {
            digits.push(letters[y % lettersBase - 1] != undefined ? letters[y % lettersBase - 1] : "z");
            if (y % lettersBase == 0) {
                y = Math.floor(y / lettersBase) - 1;
            }
            else {
                y = Math.floor(y / lettersBase);
            }
        }
        digits = digits.reverse();
        for (let d in digits) {
            digitsResult += digits[d];
        }
        ui.abstractCalc.statusText.innerHTML = "1e" + x + " in scientific notation is " + (Math.pow(10, (x % 3))) + " " + digitsResult + " in abstract notation";
    }

    return "what dis xd";
}