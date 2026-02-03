// this file has the
// categories, games, tools, various functions (rendering etc)

const games = [
    new Game("Scrap 2", "games/scrap2.png", ["combines", "scrap", "misc", "sc2_all"]),
    new Game("Scrap Collector", "games/scrap_collector.png", ["scrap_collector"]),
    new Game("SC2FMFR", "games/sc2fmfr.png", ["sc2fmfr"])
];

const categories = {
    combines: new Category("combines", "GC/Combines", "subcategories/sc2_gcCombines.png", [
        "globalChallengeStatus", "combineGainCalc", "tokenCostCalc"
    ]),
    scrap: new Category("scrap", "Scrap prod", "subcategories/sc2_scrapProd.png", [
        "moreScrapCalc", "barrelProductionCalc"
    ]),
    misc: new Category("misc", "Other", "subcategories/sc2_misc.png", [
        "achievementBoostCalc", "abstractScientificConverter", "mergePaceCalc"
    ]),
    sc2_all: new Category("sc2_all", "All", "games/scrap2.png", [
        "all", "Scrap 2"
    ]),

    scrap_collector: new Category("scrap_collector", "Scrap Collector", "games/scrap_collector.png", [
        "sco_prestigeGSCalc", "sco_starCalc", "sco_SYCalc", "sco_ScrapBoostCalc"
    ]),

    sc2fmfr: new Category("sc2fmfr", "SC2FMFR", "games/sc2fmfr.png", [
        "barrelProductionCalc", "fmfr_secondDimCalc", "fmfr_fairyDustCalc", "fmfr_alienDustCalc", "fmfr_starDustCalc", "fmfr_import"
    ])
};

const tools = {
    globalChallengeStatus: new Tool(
        `
        <img src="images/tools/globeIcon.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Global Challenge Status</h3>
            <span id="textGC"></span>
        </div>
`,
        ["textGC"],
        () => { },
        () => { calculateGlobalChallengeTime(); }
    ),



    combineGainCalc: new Tool(
        `
        <img src="images/tools/combineToken.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Combine Gain Calc</h3>
            Calculate how many Combine Tokens you earn from a Global Challenge!
            <hr style="clear: both" />

            <div class="leftArea" id="combinesLeft">
                Combine gain boosts: <br />
                More Tokens (Mastery Upgrade) level: <input id="moreTokensLevel" value="10" type="number" /> <br />
                OR Stars: <input id="moreTokensLevel2" placeholder="2000" type="number" class="inputOptional" /> <br />
                *More Tokens is unlocked at x500 Stars, below x500 you can leave these empty
            </div>
            <div class="rightArea" id="combinesRight">
                Global Challenge progress: <br />
                Global Progress (x1 - x5) <input id="progressGlobal" min="0" max="5" value="5" type="range" /> <span id="progressGlobalText">x5</span> <br />
                Your Progress (x1 - x5) <input id="progressYours" min="0" max="5" value="5" type="range" /> <span id="progressYoursText">x5</span>
            </div>

            <hr style="clear: both" />
            <span id="textCGC"></span>
        </div>
`,
        ["textCGC", "combinesLeft", "combinesRight", "moreTokensLevel", "moreTokensLevel2",
            "progressGlobal", "progressYours", "progressGlobalText", "progressYoursText"],
        () => {
            ui.combineGainCalc.moreTokensLevel.oninput = () => { ui.combineGainCalc.moreTokensLevel2.value = "" }
            ui.combineGainCalc.moreTokensLevel2.oninput = () => { ui.combineGainCalc.moreTokensLevel.value = "" }
            ui.combineGainCalc.progressGlobal.oninput = () => { ui.combineGainCalc.progressGlobalText.innerHTML = "x" + ui.combineGainCalc.progressGlobal.value }
            ui.combineGainCalc.progressYours.oninput = () => { ui.combineGainCalc.progressYoursText.innerHTML = "x" + ui.combineGainCalc.progressYours.value }
            ui.combineGainCalc.progressGlobal.value = "5";
            ui.combineGainCalc.progressYours.value = "5";
        },
        () => { combineGainCalc_update(); }
    ),



    moreScrapCalc: new Tool(
        `
        <img src="images/tools/bookScrap.png" class="boxImg" />
        <div class="box boxSize">
            <h3>More Scrap Calc</h3>
            Calculate what level your More Scrap Book upgrade should be! <br />  <br />

            More Golden Scrap (Book upgrade) level: <input id="moreGSLevel" placeholder="0" type="number" /> <br />
            Highest Scrap Ever: <input id="highestScrapEver" placeholder="100 or 1e100" type="text" /> <br />
            (Optional, for more precise calculation): More Scrap (Book upgrade) level: <input id="moreScrapLevel" placeholder="0" type="text" /> <br />
            <span id="textMSC"></span>

            <br />
            <hr style="clear: both" />
            Formulas and research made by K. whale. <br />
            <img src="images/assets/moreScrapFormula.png" style="width: 50%" /> <br />

            <i>
                Formulas: <br />
                <b>(simple) a =</b> log(1.4) / log(highest scrap ever) <br />
                <b>(complex) a =</b> log(1.4) / (log(highest scrap ever) - more scrap level * log(1.4)) <br />
                <b>more scrap level =</b> - 1 / 2a + root(x² + x / 0.03 + 1 / 4a²) where x is the more gs level
            </i>
        </div>
`,
        ["textMSC", "moreGSLevel", "moreScrapLevel", "highestScrapEver"],
        () => { },
        () => { calculateMoreScrap(); }
    ),



    tokenCostCalc: new Tool(
        `
        <img src="images/tools/combineToken.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Token Cost Calc</h3>
            Calculate how many tokens you need to do the desired combination x times, or how many times you can do it with x tokens! The order of the two ads makes no difference. <br /> <br />

            <!-- This bit could be not-repeated if generated via code... but do you think I am gonna bother with that at 11 pm -->
            Select ads:
            <select name="combination1" id="selectedAd1">
                <option value="none">Select ad 1</option>
                <option value="automerge">Auto Merge</option>
                <option value="bricks">x100 Bricks</option>
                <option value="moremagnets">More Magnets</option>
                <option value="morescrap">More Scrap</option>
                <option value="fasterbarrels">Faster Barrels</option>
                <option value="flu">Faster Level Up</option>
                <option value="morefragments">More Fragments</option>
            </select> x
            <select name="combination2" id="selectedAd2">
                <option value="none">Select ad 2</option>
                <option value="automerge">Auto Merge</option>
                <option value="bricks">x100 Bricks</option>
                <option value="moremagnets">More Magnets</option>
                <option value="morescrap">More Scrap</option>
                <option value="fasterbarrels">Faster Barrels</option>
                <option value="flu">Faster Level Up</option>
                <option value="morefragments">More Fragments</option>
            </select>

            <br />
            How many times to combine: <input id="tokenCostAmountOfAds" value="1" min="0" type="number" oninput="ui.tokenCostCalc.tokenCostAmountOfTokens.value = 0;" /><br />
            OR: how many tokens you want to spend <input id="tokenCostAmountOfTokens" placeholder="0" min="0" type="number" class="inputOptional" oninput="ui.tokenCostCalc.tokenCostAmountOfAds.value = 0;" /><br />
            <br />

            <span id="textTCC"></span>

            <br />
            <hr style="clear: both" />
            <br />
            <img src="images/assets/Tokentable.png" style="width: 30%; min-width: 256px" /> <br />
        </div>
`,
        ["textTCC", "selectedAd1", "selectedAd2", "tokenCostAmountOfAds", "tokenCostAmountOfTokens"],
        () => {
            // GO BOTHER WITH IT!
        },
        () => { calculateTokenCosts(); }
    ),



    barrelProductionCalc: new Tool(
        `
        <img src="images/tools/barrelProduction.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Barrel Production Calc</h3>
            Calculate how much scrap you get from a barrel based on your Circle Blue production. <br />

            Circle Blue production in scientific (ie 1.561e102): <input id="bpcFirstProd" value="1" type="text" /> <br />
            Barrel to calculate: #<input id="bpcBarrelNr" placeholder="661" type="number" /> <br />

            <br />
            <span id="textBPC"></span>
        </div>
`,
        ["textBPC", "bpcFirstProd", "bpcBarrelNr"],
        () => { },
        () => { calculateBarrelProduction();  }
    ),



    achievementBoostCalc: new Tool(
        `
        <img src="images/tools/achievementBoost.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Achievement Boost Calc</h3>
            Calculate how many Crystals it costs to upgrade an Achievement Boost <br />

            Start level: <input id="abcStart" value="50" type="number" /> <br />
            Goal level:  <input id="abcGoal" placeholder="100" type="number" /> <br />
            <!-- Achievements:  <input id="abcAchievements" placeholder="348" type="number" /> <br /> -->

            <br />
            <span id="textABC"></span>
        </div>
`,
        ["textABC", "abcStart", "abcGoal"],
        () => { },
        () => { calculateAchievementBoost(); }
    ),



    abstractScientificConverter: new Tool(
        `
        <img src="images/tools/abstractCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Abstract &lt;-&gt; Scientific Converter</h3>
            Convert between numbers in abstract and scientific notation <br />
            Especially useful for tires and screenshots, python original by K. Whale <br />

            <input id="inputAbstract" placeholder="ex.: big or 4782 or 1e4782" type="text" onkeyup="calculateAbstract();" style="min-width: 33%;" /> <br />

            <span id="textAbstract"></span>
        </div>
`,
        ["textAbstract", "inputAbstract"],
        () => { },
        () => { }
    ),



    mergePaceCalc: new Tool(
        `
        <img src="images/tools/mergePaceCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Merge Pace Calc</h3>
            Figure out roughly how fast an average FB speed would be over longer durations. <br />
            Note that breaks, sleep, etc. are not calculated in by default, but you can insert how much of the time you are taking a break, to get a less tryhard estimate.

            <br />
            (Optional) Break time: <input id="mpcBreakTime" value="" type="number" />% of the time <br />
            Merges in FB: <input id="mpcMerges" value="3000" type="number" /> <br />
            Ad trick?: <input id="mpcAdTrick" type="checkbox" /> <br />
            Ad tokens?: <input id="mpcAdTokens" type="checkbox" /> <br />
            5s/puzzle ads?: <input id="mpcFastAds" type="checkbox" /> <br />
            <br />

            <span id="textMPC"></span>
        </div>
`,
        ["textMPC", "mpcBreakTime", "mpcMerges", "mpcAdTrick", "mpcAdTokens", "mpcFastAds"],
        () => { },
        () => {
            let merges = ui.mergePaceCalc.mpcMerges.value;
            let breakTime = ui.mergePaceCalc.mpcBreakTime.value;
            let adTrick = ui.mergePaceCalc.mpcAdTrick.checked;
            let adTokens = ui.mergePaceCalc.mpcAdTokens.checked;
            let fastAds = ui.mergePaceCalc.mpcFastAds.checked;

            // time between ads is 15s, used to be 25s
            let fbDuration = 600 + (adTrick == true ? 0 : 15) + (adTokens == true ? 0 : (fastAds ? 5 : 30));
            let fbsPerHour = (3600 / fbDuration).toFixed(2);

            let breakRatio = Math.max(0, (breakTime != "" && breakTime > 0) ? 1 - (breakTime / 100) : 1);
            let hoursPerDay = 24 * breakRatio;

            ui.mergePaceCalc.statusText.innerHTML = "At " + merges + "/fb (" + fbsPerHour + "FB/h, " + fbDuration + "s/FB),"
                + (breakRatio > 0 ? " " + hoursPerDay.toFixed(1) + " hours per day," : "")
                + "<table align='center'>"
                + "<tr><td>Per hour: </td><td>" + Math.floor(3600 / fbDuration * merges * breakRatio).toLocaleString() + "</td></tr>"
                + "<tr><td>Per 6 hours: </td><td>" + Math.floor(6 * 3600 / fbDuration * merges * breakRatio).toLocaleString() + "</td></tr>"
                + "<tr><td>Per 12 hours: </td><td>" + Math.floor(12 * 3600 / fbDuration * merges * breakRatio).toLocaleString() + "</td></tr>"
                + "<tr><td>Per day: </td><td>" + Math.floor(24 * 3600 / fbDuration * merges * breakRatio).toLocaleString() + "</td></tr>"
                + "<tr><td>Per week: </td><td>" + Math.floor(7 * 24 * 3600 / fbDuration * merges * breakRatio).toLocaleString() + "</td></tr>"
                + "</table>";
        }
    ),



    sco_prestigeGSCalc: new Tool(
        `
        <img src="images/tools/sco_prestigeGSCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Prestige GS Calc</h3>
            Find out how much GS you can get in Scrap Collector <br />

            Total Scrap (this prestige): <input id="SCOPGS_Scrap" placeholder="ex.: 100 or 1e100" type="text" style="min-width: 33%;" /> <br />
            More GS Level: <input id="SCOPGS_MoreGS" placeholder="0 - 40" type="text" min="0" max="40" value="0" style="min-width: 33%;" /> <br />
            Collected Barrels (this prestige): <input id="SCOPGS_CollectedBarrels" placeholder="ex.: 14000 or 1.4e4" type="text" style="min-width: 33%;" /> <br />
            10 Stars or more?: <input id="SCOPGS_Stars" type="checkbox" /> <br />

            <span id="textSCOPGS"></span>
        </div>
`,
        ["textSCOPGS", "SCOPGS_Scrap", "SCOPGS_MoreGS", "SCOPGS_CollectedBarrels", "SCOPGS_Stars"],
        () => { },
        () => {
            /*
            `GoldenScrap = 25 * max[0, log10(s) - 9] 
             * max[1, max(0, log10(s) - 30) / 8]
             * max[1, max(0, log10(s) - 100) / 15]
             * (1 + MoreGoldenScrapLevel * 0.05)
        
            (When Stars >= 10:)
             * (1 + (BarrelsCollectedSincePrestige / 1000) * 0.0125)`
            */

            ui.sco_prestigeGSCalc.statusText.innerHTML = "";

            let scrap = ui.sco_prestigeGSCalc.SCOPGS_Scrap.value;
            if (scrap == "") return false;
            scrap = normalizeScientific(scrap);
            scrap = Math.log10(scrap);

            let GS = 25 * Math.max(0, scrap - 9)
                * Math.max(1, Math.max(0, scrap - 30) / 8)
                * Math.max(1, Math.max(scrap - 100) / 15)
                * (1 + ui.sco_prestigeGSCalc.SCOPGS_MoreGS.value * 0.05);
            if (ui.sco_prestigeGSCalc.SCOPGS_Stars.checked == true) {
                GS *= (1 + (ui.sco_prestigeGSCalc.SCOPGS_CollectedBarrels.value / 1000) * 0.0125);
            }

            ui.sco_prestigeGSCalc.statusText.innerHTML = "You should get +" + Math.floor(GS) + " GS";
        }
    ),



    sco_starCalc: new Tool(
        `
        <img src="images/tools/sco_starCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Star Calc</h3>
            Get the cost for a Star in Scrap Collector <br />

            From: <input id="SCOSC_StarsFrom" placeholder="ex.: 100" type="text" style="min-width: 33%;" /><br />
            To: <input id="SCOSC_StarsTo" placeholder="ex.: 100" type="text" style="min-width: 33%;" /><br />
            Scrapyard level: <input id="SCOSC_Scrapyard" placeholder="ex.: 1 or 100" type="text" style="min-width: 33%;" /><br />
            <br />
            (Optional) Better Discount level: <input id="SCOSC_Better_Discount" placeholder="0 - 100" type="text" style="min-width: 33%;" /><br />
            <!--(Optional) Better Boost level: <input id="SCOSC_Better_Boost" placeholder="0 - 100" type="text" style="min-width: 33%;" /><br />-->
            <br />

            <span id="textSCOSC"></span>
        </div>
`,
        ["textSCOSC", "SCOSC_StarsFrom", "SCOSC_StarsTo", "SCOSC_Scrapyard", "SCOSC_Better_Discount"/*, "SCOSC_Better_Boost"*/],
        () => { },
        () => {
            let starsFrom = parseInt(ui.sco_starCalc.SCOSC_StarsFrom.value);
            let starsTo = ui.sco_starCalc.SCOSC_StarsTo.value;
            //console.log(starsFrom, starsTo);

            ui.sco_starCalc.statusText.innerHTML = "";
            if (starsTo == "" || starsTo == undefined) return false;
            starsTo = parseInt(starsTo);

            // only one star
            if (isNaN(starsFrom) && ui.sco_starCalc.SCOSC_StarsFrom.value == "") {
                starsFrom = starsTo - 1;
            }

            if (starsTo - starsFrom > 1e5) return false; // too heavy

            // false way around?
            if (starsFrom > starsTo) {
                let tmp = starsFrom;
                starsFrom = starsTo;
                starsTo = tmp;
            }

            let stars = starsFrom;
            let accumulatedCost = 0;

            // first six stars
            if (stars < 6) {
                // 1, 2, 3, 4, 5, 6 are fixed
                let fixedCosts = [0, 3000, 6000, 15000, 25000, 40000, 50000];

                for (let s = stars; s < 6 && s < starsTo; s++) {
                    accumulatedCost += fixedCosts[s + 1];
                    stars++;
                    //console.log(s, s + 1, accumulatedCost);
                }
            }

            // main calc
            if (starsTo > 6) {
                let val1, val2;
                for (let s = stars; s < starsTo; s++) {
                    val1 = Math.pow(1 + Math.max(0, s - 9) / 20, 2.1);
                    val2 = Math.pow(1.0075, Math.max(0, s - 100));

                    accumulatedCost += s * 10000 * Math.max(1, val1) * Math.max(1, val2);
                    //console.log(val1, val2, accumulatedCost);
                }
            }

            // not sure why this is needed
            accumulatedCost = accumulatedCost - 1;

            // scrapyard cost reduction
            //if (ui.sco_starCalc.SCOSC_Scrapyard.value.substr(-1) == "%") ui.sco_starCalc.SCOSC_Scrapyard.value = ui.sco_starCalc.SCOSC_Scrapyard.value.substr(0, ui.sco_starCalc.SCOSC_Scrapyard.value.length - 1);
            let syLevel = parseFloat(ui.sco_starCalc.SCOSC_Scrapyard.value);
            let baseCost = 0;

            if (syLevel > 1 && !isNaN(syLevel)) {
                baseCost = Math.floor(accumulatedCost);

                accumulatedCost = Math.floor(accumulatedCost);
                accumulatedCost *= calcSCOScrapyard(syLevel);
            }

            // better discount & break even
            let betterDiscount = ui.sco_starCalc.SCOSC_Better_Discount.value;
            let discountedPrice = 0;
            let discountReturn = 0;
            let breakEven = 0;

            if (betterDiscount != "" && betterDiscount > 0) {
                // +0.25% / lvl, up to lvl 100 (25%)
                discountReturn = accumulatedCost * Math.min(betterDiscount, 100) * 0.25 / 100;
                breakEven = Math.floor((accumulatedCost - discountReturn) * 4.3333333333333333);

                discountedPrice = Math.floor(accumulatedCost) - Math.floor(discountReturn);

            }
            else {
                betterDiscount = 0;
                breakEven = Math.floor(accumulatedCost * 4.3333333333333333);
            }

            accumulatedCost = Math.floor(accumulatedCost);

            // break even point
            //let betterBoost = ui.sco_starCalc.SCOSC_Better_Boost.value;
            //breakEven = Math.floor(accumulatedCost * (1 - 0.0025 * Math.min(betterDiscount, 100)) * 4.3333333333333333);
            

            ui.sco_starCalc.statusText.innerHTML = "Going from " + starsFrom + " to " + starsTo + " Stars should cost: " + accumulatedCost.toLocaleString() + " GS"
                + (baseCost > 0 ? "<br />Base cost: " + baseCost.toLocaleString() : "")
                + (betterDiscount > 0 ? "<br /><br />You get back: " + Math.floor(discountReturn).toLocaleString() + " GS"
                    + "<br />Discounted price: " + discountedPrice.toLocaleString() + " GS" : "")
                + "<br />Break even point: " + breakEven.toLocaleString() + " GS";
        }
    ),



    sco_SYCalc: new Tool(
        `
        <img src="images/tools/sco_scrapyardCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Scrapyard Calc</h3>
            Get the cost and effect for Scrapyard at a level <br />

            Scrapyard level: <input id="SCOSY_Scrapyard" placeholder="ex.: 1 or 100" type="text" style="min-width: 33%;" /><br />
            Cheaper Scrapyard level: <input id="SCOSY_CheaperScrapyardLvl" placeholder="0 - 100" type="text" style="min-width: 33%;" /><br />
            <br />

            <span id="textSCOSY"></span>
        </div>
`,
        ["textSCOSY", "SCOSY_Scrapyard", "SCOSY_CheaperScrapyardLvl"],
        () => { },
        () => {
            let syLevel = ui.sco_SYCalc.SCOSY_Scrapyard.value;
            if (syLevel == "" || syLevel < 1) return false;
            syLevel = parseInt(syLevel);

            let cheaperScrapyard = ui.sco_SYCalc.SCOSY_CheaperScrapyardLvl.value;
            if (cheaperScrapyard == "" || cheaperScrapyard < 1) cheaperScrapyard = 0;

            let syPrice = 1e12 * Math.pow(10, syLevel) * Math.pow(0.01, cheaperScrapyard);
            syPrice = syPrice.toString();
            syPrice = Math.round(syPrice.split("e+")[0]) + "e" + syPrice.split("e+")[1];

            ui.sco_SYCalc.statusText.innerHTML = "Level " + syLevel + " to " + (syLevel + 1) + " costs: " + syPrice + " (for 10 taps)"
                + "<br />Effect at level " + syLevel + ": " + calcSCOScrapyard(syLevel).toFixed(3) + "%"
                + "<br />Effect at level " + (syLevel + 1) + ": " + calcSCOScrapyard(syLevel + 1).toFixed(3) + "%";
        }
    ),



    sco_ScrapBoostCalc: new Tool(
        `
        <img src="images/tools/sco_scrapBoostCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Scrap Boost Calc</h3>
            Similar to Scrap 2's (Million) Merge Boost, you get a boost on your Scrap production. It can be found ingame at the stats. <br />

            Collected Barrels: <input id="SCOSBC_Collected" placeholder="ex.: 1 or 1e6" type="text" style="min-width: 33%;" /><br />
            OR desired boost: x<input id="SCOSBC_DesiredBoost" placeholder="1 or more" type="text" style="min-width: 33%;" /><br />
            <br />

            <span id="textSCOSBC"></span>
        </div>
`,
        ["textSCOSBC", "SCOSBC_Collected", "SCOSBC_DesiredBoost"],
        () => {
            ui.sco_ScrapBoostCalc.SCOSBC_Collected.oninput = () => { ui.sco_ScrapBoostCalc.SCOSBC_DesiredBoost.value = "" }
            ui.sco_ScrapBoostCalc.SCOSBC_DesiredBoost.oninput = () => { ui.sco_ScrapBoostCalc.SCOSBC_Collected.value = "" }
        },
        () => {
            let collectedBarrels = ui.sco_ScrapBoostCalc.SCOSBC_Collected.value;
            let desiredBoost = ui.sco_ScrapBoostCalc.SCOSBC_DesiredBoost.value;

            if (collectedBarrels != "") {
                // get boost based on barrels
                let boost = Math.pow(1.05, Math.floor(collectedBarrels / 100000));
                ui.sco_ScrapBoostCalc.statusText.innerHTML = "Boost: x" + Math.floor(boost) + " Scrap";
            }
            else if (desiredBoost != "") {
                // get needed barrels based on boost
                collectedBarrels = Math.floor(new Decimal(desiredBoost).log(1.05) + 1) * 1e5;
                ui.sco_ScrapBoostCalc.statusText.innerHTML = "Needed collects: " + collectedBarrels.toLocaleString();
            }
            else {
                // nothing
                ui.sco_ScrapBoostCalc.statusText.innerHTML = "";
            }
        }
    ),



    fmfr_secondDimCalc: new Tool(
        `
        <img src="images/tools/fmfr_secondDimCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Second Dimension Calc</h3>
            The optimal strategy is to reach the max. of Better Barrels, and then leave the Second Dimension. <br />
            The max. is equal to the highest barrel you reached in the first dimension. <br />
            Every merge gives a Scrap boost for the run, with manual merges giving more. <br />
            <br />

            Better Barrels max.: <input id="FMFR2DIM_BB" type="text" style="min-width: 33%;" /> <br />
            Dark Fragment upgrade: <input id="FMFR2DIM_DarkFrag" type="text" style="min-width: 33%;" /> <br />
            Faster 2nd Dim Emblem upgrade?: <input id="SCOPGS_EmblemUpg" type="checkbox" /> <br />
            Auto merge?: <input id="SCOPGS_AutoMerge" type="checkbox" /> <br />

            <span id="textFMFR2DIM"></span>
        </div>
`,
        ["textFMFR2DIM", "FMFR2DIM_BB", "FMFR2DIM_DarkFrag", "SCOPGS_EmblemUpg", "SCOPGS_AutoMerge"],
        () => { },
        () => {
            let bbMax = ui.fmfr_secondDimCalc.FMFR2DIM_BB.value;
            if (bbMax == "" || bbMax < 1) return false;
            let darkFragUpgrade = ui.fmfr_secondDimCalc.FMFR2DIM_DarkFrag.value;
            if (darkFragUpgrade == "" || darkFragUpgrade < 0) darkFragUpgrade = 0;
            let emblemUpgrade = ui.fmfr_secondDimCalc.SCOPGS_EmblemUpg.checked;
            let autoMerge = ui.fmfr_secondDimCalc.SCOPGS_AutoMerge.checked;

            // calc price for BB
            let pow =
                [
                    Decimal.pow(2, Math.min(10, bbMax)),
                    Decimal.pow(4, Math.max(0, bbMax - 10)),
                    Decimal.pow(2, Math.ceil(Math.max(0, bbMax - 29) / 10)),
                    Decimal.pow(2, Math.ceil(Math.max(0, bbMax - 54) / 10)),
                    Decimal.pow(1.2, Math.max(0, bbMax - 500)),
                    Decimal.pow(1.2, Math.max(0, bbMax - 1250)),
                    Decimal.pow(1.2, Math.max(0, bbMax - 2500)),
                    Decimal.pow(1.2, Math.max(0, bbMax - 5000)),
                    Decimal.pow(1.2, Math.max(0, bbMax - 15000)),
                    Decimal.pow(1.4, Math.max(0, bbMax - 25000)),
                    Decimal.pow(1.3, Math.max(0, bbMax - 50000)),
                    Decimal.pow(1.6, Math.max(0, bbMax - 83000)),
                    Decimal.pow(10, Math.max(0, bbMax - 225000))
                ];

            let bbPrice = new Decimal(25000);
            for (let d of pow) {
                bbPrice = bbPrice.mul(d);
            }

            // calc scrap prod
            let darkFragEffect = new Decimal(10).pow(2 - darkFragUpgrade).mul(new Decimal(11).pow(darkFragUpgrade)).div(Math.log(11) - Math.log(10));

            let scrapProdFormula = (merges) => new Decimal(Decimal.pow(1.1, autoMerge ? merges : merges * 3)
                .mul(new Decimal(1.05 + ((bbMax / 100000) * emblemUpgrade)).pow(merges))
                .mul(1 + darkFragEffect));;
            let merges = 0;
            let mergeIncrease = 10000;
            let scrapProd = new Decimal(0);

            while (scrapProd.lt(bbPrice)) {
                if (scrapProdFormula(merges + mergeIncrease).lt(bbPrice)) {
                    merges += mergeIncrease;
                    scrapProd = scrapProdFormula(merges);
                }
                else if (mergeIncrease > 1) mergeIncrease /= 10;
                else break;
            }

            let scrapProdString = scrapProd.toString();
            scrapProdString = scrapProdString.split(".")[0] + (scrapProdString.split("e+")[1] != undefined ? "e" + scrapProdString.split("e+")[1] : "");

            ui.fmfr_secondDimCalc.statusText.innerHTML = "This costs " + scrapProdString + " Scrap"
                + "<br />Which is " + merges + " merges";
        }
    ),



    fmfr_fairyDustCalc: new Tool(
        `
        <img src="images/tools/fmfr_fairyDustCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Fairy Dust Calc</h3>
            Calculates Fairy Dust gains <br />
            Play around with your values to see how you can efficiently gain more <br />

            Beams: <input id="FMFR_FDC_Beams" type="text" /> <br />
            Aerobeams: <input id="FMFR_FDC_Aerobeams" type="text" /> <br />
            Angel Beams: <input id="FMFR_FDC_AngelBeams" type="text" /> <br />
            Re Beams: <input id="FMFR_FDC_ReBeams" type="text" /> <br />
            Glitch Beams: <input id="FMFR_FDC_GlitchBeams" type="text" /> <br />
            <br />

            Current Bricks: <input id="FMFR_FDC_Bricks" type="text" /> <br />
            Total Plastic Bags: <input id="FMFR_FDC_PlasticBags" type="text" /> <br />
            Total Screws: <input id="FMFR_FDC_Screws" type="text" /> <br />
            Total Quests completed: <input id="FMFR_FDC_Quests" type="text" /> <br />
            Total Merge Tokens: <input id="FMFR_FDC_MergeTokens" type="text" /> <br />
            <br />

            Fairy Pin level: <input id="FMFR_FDC_PinLevel" type="text" /> <br />
            More Dust level: <input id="FMFR_FDC_DustLevel" type="text" /> <br />

            <span id="textFMFRFDC"></span>
        </div>
`,
        ["textFMFRFDC", "FMFR_FDC_Beams", "FMFR_FDC_Aerobeams", "FMFR_FDC_AngelBeams", "FMFR_FDC_ReBeams", "FMFR_FDC_GlitchBeams",
            "FMFR_FDC_Bricks", "FMFR_FDC_PlasticBags", "FMFR_FDC_Screws", "FMFR_FDC_Quests", "FMFR_FDC_MergeTokens",
            "FMFR_FDC_PinLevel", "FMFR_FDC_DustLevel"],
        () => { },
        () => {
            let items = ui.fmfr_fairyDustCalc;
            for (let i in items) {
                if (i != "textFMFRFDC") items[i.split("FDC_")[1]] = new Decimal(items[i].value != "" ? items[i].value : 0);
            }

            let amount = new Decimal(items.Beams.div(1e4).sqrt().max(1));
            amount = amount.mul(items.Aerobeams.div(1e4).sqrt().max(1));
            amount = amount.mul(items.AngelBeams.div(1e4).sqrt().max(1));
            amount = amount.mul(items.ReBeams.div(1e4).sqrt().max(1));
            amount = amount.mul(items.GlitchBeams.div(1e4).sqrt().max(1)).round();

            amount = amount.mul(Math.max(1, elog(items.Bricks.add("1e500000"), "1e500000")));
            amount = amount.mul(Math.max(1, items.PlasticBags.add(450).log(450)));
            amount = amount.mul(Math.max(1, items.Screws.add(10000).log(10000)));
            amount = amount.mul(Math.max(1, items.Quests.add(250).log(250)));
            amount = amount.mul(Math.max(1, items.MergeTokens.add(10000).log(10000)));

            amount = amount.mul(new Decimal(1).add(items.PinLevel * 0.05).pow(Math.max(1, items.PinLevel / 24)));
            amount = amount.mul(1 + 0.2 * items.DustLevel);

            ui.fmfr_fairyDustCalc.statusText.innerHTML = "You should get: " + parseInt(amount.toString().split(".")[0]).toLocaleString() + " Fairy Dust";
        }
    ),



    fmfr_alienDustCalc: new Tool(
        `
        <img src="images/tools/fmfr_alienDustCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Alien Dust Calc</h3>
            Calculates Alien Dust gains <br />
            Play around with your values to see how you can efficiently gain more <br />

            Current Legendary Scrap: <input id="FMFR_ADC_LegendaryScrap" type="text" /> <br />
            Current Steel Magnets: <input id="FMFR_ADC_SteelMagnets" type="text" /> <br />
            Current Blue Bricks: <input id="FMFR_ADC_BlueBricks" type="text" /> <br />
            Current Buckets: <input id="FMFR_ADC_Buckets" type="text" /> <br />
            Current Fishing Nets: <input id="FMFR_ADC_FishingNets" type="text" /> <br />
            <br />

            Levels of all Auto Upgraders combined: <input id="FMFR_ADC_AutoUpgraders" type="text" /> <br />
            Levels of all Auto Collectors combined: <input id="FMFR_ADC_AutoCollectors" type="text" /> <br />
            <br />

            Venus: <input id="FMFR_ADC_Venus" type="text" value="20" /> <br />
            Neptune: <input id="FMFR_ADC_Neptune" type="text" value="50" /> <br />
            Uranus: <input id="FMFR_ADC_Uranus" type="text" value="16" /> <br />
            Posus: <input id="FMFR_ADC_Posus" type="text" /> <br />
            Mythus: <input id="FMFR_ADC_Mythus" type="text" /> <br />
            Sun: <input id="FMFR_ADC_Sun" type="text" value="5000" /> <br />
            <br />

            Fairy Pin level: <input id="FMFR_ADC_PinLevel" type="text" /> <br />
            More Dust level: <input id="FMFR_ADC_DustLevel" type="text" /> <br />
            More Alien Dust level: <input id="FMFR_ADC_BoostLevel" type="text" /> <br />

            <span id="textFMFRADC"></span>
        </div>
`,
        ["textFMFRADC", "FMFR_ADC_LegendaryScrap", "FMFR_ADC_SteelMagnets", "FMFR_ADC_BlueBricks", "FMFR_ADC_Buckets", "FMFR_ADC_FishingNets",
            "FMFR_ADC_AutoUpgraders", "FMFR_ADC_AutoCollectors",
            "FMFR_ADC_Venus", "FMFR_ADC_Neptune", "FMFR_ADC_Uranus", "FMFR_ADC_Posus", "FMFR_ADC_Mythus", "FMFR_ADC_Sun",
            "FMFR_ADC_PinLevel", "FMFR_ADC_DustLevel", "FMFR_ADC_BoostLevel"],
        () => { },
        () => {
            let items = ui.fmfr_alienDustCalc;
            for (let i in items) {
                if (i != "textFMFRADC") items[i.split("ADC_")[1]] = new Decimal(items[i].value != "" ? items[i].value : 0);
            }

            let amount = new Decimal(items.LegendaryScrap.add(25).log(25));
            amount = amount.add(Math.max(1, items.SteelMagnets.add(125).log(125)));
            amount = amount.add(Math.max(1, items.BlueBricks.add(100).log(100)));
            amount = amount.add(Math.max(1, items.Buckets.add(50).log(50)));
            amount = amount.add(Math.max(1, items.FishingNets.add(20).log(20)));

            amount = amount.add(items.AutoUpgraders / 5);
            amount = amount.add(items.AutoCollectors / 5);

            amount = amount.add(items.Venus / 25);
            amount = amount.add(items.Neptune / 5);
            amount = amount.add(items.Uranus / 5);
            amount = amount.add(items.Posus / 100);

            amount = amount.mul(1 + (items.Mythus / 200));
            amount = amount.mul(1 + (items.Sun / 100));

            amount = amount.mul(new Decimal(1).add(items.PinLevel * 0.05).pow(Math.max(1, items.PinLevel / 24)));
            amount = amount.div(6).mul(1 + 0.2 * items.DustLevel);
            amount = amount.mul(new Decimal(1).add(0.2 * items.BoostLevel));

            ui.fmfr_alienDustCalc.statusText.innerHTML = "You should get: " + parseInt(amount.toString().split(".")[0]).toLocaleString() + " Alien Dust";
        }
    ),



    fmfr_starDustCalc: new Tool(
        `
        <img src="images/tools/fmfr_starDustCalc.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Star Dust Calc</h3>
            Calculates Star Dust gains <br />
            Play around with your values to see how you can efficiently gain more <br />

            Golden Scrap: <input id="FMFR_SDC_GoldenScrap" type="text" /> <br />
            Magnitov: <input id="FMFR_SDC_Magnitov" type="text" /> <br />
            Fragments: <input id="FMFR_SDC_Fragments" type="text" /> <br />
            Dark Scrap: <input id="FMFR_SDC_DarkScrap" type="text" /> <br />
            Merge Mastery prestige level: <input id="FMFR_SDC_MergeMastery" type="text" /> <br />
            Tires: <input id="FMFR_SDC_Tires" type="text" /> <br />
            <br />

            Fairy Pin level: <input id="FMFR_SDC_PinLevel" type="text" /> <br />
            More Dust level: <input id="FMFR_SDC_DustLevel" type="text" /> <br />

            <span id="textFMFRSDC"></span>
        </div>
`,
        ["textFMFRSDC", "FMFR_SDC_GoldenScrap", "FMFR_SDC_Magnitov", "FMFR_SDC_Fragments", "FMFR_SDC_DarkScrap", "FMFR_SDC_MergeMastery", "FMFR_SDC_Tires", 
            "FMFR_SDC_PinLevel", "FMFR_SDC_DustLevel"],
        () => { },
        () => {
            let items = ui.fmfr_starDustCalc;
            for (let i in items) {
                if (i != "textFMFRSDC") items[i.split("SDC_")[1]] = new Decimal(items[i].value != "" ? items[i].value : 0);
            }

            let amount = new Decimal(Math.max(1, items.GoldenScrap.add(1e50).min("1e3050").log(1e50)));
            amount = amount.mul(Math.max(1, items.Magnitov.add(1e200).min("1e30050").log(1e200)));
            amount = amount.mul(Math.max(1, items.Fragments.add(1e50).log(1e50)));
            amount = amount.mul(Math.max(1, elog(items.GoldenScrap.add("1e500").min("1e9050"), "1e500")));
            amount = amount.mul(Math.max(1, items.DarkScrap.add(1e20).log(1e20)));
            amount = amount.mul(Math.max(1, items.MergeMastery.add(1000).log(1000)));
            amount = amount.add(elog(items.Tires.add("1e1000000"), "1e1000000"));

            amount = amount.mul(new Decimal(1).add(items.PinLevel * 0.05).pow(Math.max(1, items.PinLevel / 24)));
            amount = amount.mul(1 + 0.2 * items.DustLevel);

            ui.fmfr_starDustCalc.statusText.innerHTML = "You should get: " + parseInt(amount.toString().split(".")[0]).toLocaleString() + " Star Dust";
        }
    ),



    fmfr_import: new Tool(
        `
        <img src="images/tools/fmfr_import.png" class="boxImg" />
        <div class="box boxSize">
            <h3>Import</h3>
            Import your SC2FMFR save to directly load your current relevant data into the calcs <br />
            <textarea id="FMFR_IMPORT" rows="6" cols="80"></textarea>
            <br />

            <span id="textFMFRIMPORT"></span>
        </div>
`,
        ["textFMFRIMPORT", "FMFR_IMPORT"],
        () => {
            ui.fmfr_import.FMFR_IMPORT.onblur = () => { importFMFRSave(); };
        },
        () => { }
    )
};



/*
calcname: new Tool(
        `

`,
        [],
        () => { },
        () => { }
    )
*/



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

function combineGainCalc_update() {
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

    ui.combineGainCalc.statusText.innerHTML = "You will earn <big>" + Math.floor(combinesEarned) + " <img src='images/assets/combineToken.png' style='width: 32px' />!</big>";

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
    let moreScrapLevel = ui.moreScrapCalc.moreScrapLevel.value != "" ? ui.moreScrapCalc.moreScrapLevel.value : -1;

    if (highestScrapEver == -1 || moreGSLevel == -1) {
        ui.moreScrapCalc.statusText.innerHTML = "Please enter your numbers";
        return false;
    }
    highestScrapEver = normalizeScientific(highestScrapEver);

    let a;
    if (moreScrapLevel != -1) {
        a = Math.log10(1.4) / (highestScrapEver.log(10) - moreScrapLevel * Math.log10(1.4));
    }
    else {
        a = Math.log10(1.4) / highestScrapEver.log(10);
    }
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
    let baseProd = ui.barrelProductionCalc.bpcFirstProd.value; // received as a string
    try {
        baseProd = new Decimal(baseProd);
    }
    catch {
        ui.barrelProductionCalc.statusText.innerHTML = "Wrong format! Do it like this: 1.567e102 or 1 or 1.749e400";
        // alert("Wrong format! Do it like this: 1.567e102 or 1 or 1.749e400");
        return false;
    }

    let barrelnr = ui.barrelProductionCalc.bpcBarrelNr.value;

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
    let levelDiff = parseInt(ui.achievementBoostCalc.abcGoal.value) - parseInt(ui.achievementBoostCalc.abcStart.value);

    if (levelDiff > 0) {
        let crystals = 0;
        for (let l = parseInt(ui.achievementBoostCalc.abcStart.value); l < parseInt(ui.achievementBoostCalc.abcGoal.value); l++) {
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
    let x = ui.abstractScientificConverter.inputAbstract.value;
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
        ui.abstractScientificConverter.statusText.innerHTML = "1 " + x + " in abstract notation is 1e" + (3 * digitsSum + 3) + " in scientific notation";
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
        ui.abstractScientificConverter.statusText.innerHTML = "1e" + x + " in scientific notation is " + (Math.pow(10, (x % 3))) + " " + digitsResult + " in abstract notation";
    }

    return "what dis xd";
}

function calcSCOScrapyard(lvl) {
    return 1 / (1
        + Math.max(0, (Math.min(lvl, 100) - 1) * 0.005)
        + Math.max(0, (Math.min(lvl, 200) - 100) * 0.01)
        + Math.max(0, (lvl - 200) * 0.02)
    );
}

function elog(value, base) {
    // library didn't support infinitely large logs, so I had to do it myself
    base = new Decimal(base);
    base = new Decimal(10).pow(base.exponent).mul(base.mantissa).log10();
    value = new Decimal(10).pow(value.exponent).mul(value.mantissa).log10();
    base = new Decimal(base);
    value = new Decimal(value);
    return value / base;
}

function importFMFRSave() {
    let game = ui.fmfr_import.FMFR_IMPORT.value;
    let len = 0;
    console.log(game);

    try {
        ui.fmfr_import.statusText.innerHTML = "Loading save...";
        game = atob(game);
        len = game.length;
        ui.fmfr_import.statusText.innerHTML = "Parsing save... (" + len + ", " + game.code + ")";
        game = JSON.parse(game);
        console.log(game);
    }
    catch (e) {
        alert("Something went wrong while trying to parse the save");
        return false;
    }

    ui.fmfr_import.statusText.innerHTML = "Loading items...";
    /*
    let uiitems = [];
    let items = ui.fmfr_fairyDustCalc;
    for (let i in items) {
        if (i != "textFMFRFDC") uiitems[i] = new Decimal(items[i].value != "" ? items[i].value : 0);
    }
    items = ui.fmfr_alienDustCalc;
    for (let i in items) {
        if (i != "textFMFRADC") uiitems[i] = new Decimal(items[i].value != "" ? items[i].value : 0);
    }
    items = ui.fmfr_starDustCalc;
    for (let i in items) {
        if (i != "textFMFRSDC") uiitems[i] = new Decimal(items[i].value != "" ? items[i].value : 0);
    }

    ui.fmfr_import.statusText.innerHTML = "Inserting save data into items...";

    console.log(uiitems.Beams, ui.fmfr_fairyDustCalc.FMFR_FDC_Beams);
    uiitems.Beams.value = game.beams.amount;
    console.log(uiitems.Beams, ui.fmfr_fairyDustCalc.FMFR_FDC_Beams);
    */

    ui.fmfr_secondDimCalc.FMFR2DIM_BB.value = Math.max(100, Math.min(2975 + game.solarSystem.upgrades.mythus.level * 50 + Math.floor(game.supernova.alienDustUpgrades.aquila.level), game.highestBarrelReached - 25));
    ui.fmfr_secondDimCalc.FMFR2DIM_DarkFrag.value = new Decimal(game.darkfragment.amount).round();
    ui.fmfr_secondDimCalc.SCOPGS_EmblemUpg.checked = game.supernova.cosmicUpgrades.faster2ndDim.level > 0 ? "true" : "false";
    ui.fmfr_secondDimCalc.SCOPGS_AutoMerge.checked = game.settings.autoMerge == true ? "true" : "false";



    ui.fmfr_fairyDustCalc.FMFR_FDC_Beams.value = new Decimal(game.stats.beamstp).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_Aerobeams.value = new Decimal(game.stats.aebeamstp).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_AngelBeams.value = new Decimal(game.stats.abeamstp).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_ReBeams.value = new Decimal(game.stats.rbeamstp).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_GlitchBeams.value = new Decimal(game.stats.gbeamstp).round();

    ui.fmfr_fairyDustCalc.FMFR_FDC_Bricks.value = new Decimal(game.bricks.amount).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_PlasticBags.value = new Decimal(game.plasticBags.total).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_Screws.value = new Decimal(game.stats.totalscrews).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_Quests.value = new Decimal(game.stats.totalquests).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_MergeTokens.value = new Decimal(game.stats.totalmergetokens).round();

    ui.fmfr_fairyDustCalc.FMFR_FDC_PinLevel.value = new Decimal(game.supernova.pins.fairyPin).round();
    ui.fmfr_fairyDustCalc.FMFR_FDC_DustLevel.value = new Decimal(game.supernova.cosmicUpgrades.moreDust.level).round();



    ui.fmfr_alienDustCalc.FMFR_ADC_LegendaryScrap.value = new Decimal(game.factory.legendaryScrap).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_SteelMagnets.value = new Decimal(game.factory.steelMagnets).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_BlueBricks.value = new Decimal(game.factory.blueBricks).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_Buckets.value = new Decimal(game.factory.buckets).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_FishingNets.value = new Decimal(game.factory.fishingNets).round();

    let autoUpgraders = 0;
    let autoCollectors = 0;
    for (i in game.autos) {
        if (game.autos[i] != undefined) autoUpgraders += game.autos[i].level;
    }
    for (i in game.collectors) {
        if (game.collectors[i] != undefined) autoCollectors += game.collectors[i].level;
    }

    ui.fmfr_alienDustCalc.FMFR_ADC_AutoUpgraders.value = new Decimal(autoUpgraders).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_AutoCollectors.value = new Decimal(autoCollectors).round();

    ui.fmfr_alienDustCalc.FMFR_ADC_Venus.value = new Decimal(game.solarSystem.upgrades.venus.level).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_Neptune.value = new Decimal(game.solarSystem.upgrades.neptune.level).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_Uranus.value = new Decimal(game.solarSystem.upgrades.uranus.level).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_Posus.value = new Decimal(game.solarSystem.upgrades.posus.level).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_Mythus.value = new Decimal(game.solarSystem.upgrades.mythus.level).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_Sun.value = new Decimal(game.solarSystem.upgrades.sun.level).round();

    ui.fmfr_alienDustCalc.FMFR_ADC_PinLevel.value = new Decimal(game.supernova.pins.alienPin).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_DustLevel.value = new Decimal(game.supernova.cosmicUpgrades.moreDust.level).round();
    ui.fmfr_alienDustCalc.FMFR_ADC_BoostLevel.value = new Decimal(game.glitchbeams.upgrades.alienDustBoost.level).round();



    ui.fmfr_starDustCalc.FMFR_SDC_GoldenScrap.value = new Decimal(game.goldenScrap.amount).round();
    ui.fmfr_starDustCalc.FMFR_SDC_Magnitov.value = new Decimal(game.magnets).round();
    ui.fmfr_starDustCalc.FMFR_SDC_Fragments.value = new Decimal(game.fragment.amount).round();
    ui.fmfr_starDustCalc.FMFR_SDC_DarkScrap.value = new Decimal(game.darkscrap.amount).round();
    ui.fmfr_starDustCalc.FMFR_SDC_MergeMastery.value = new Decimal(game.mergeMastery.prestige.level).round();
    ui.fmfr_starDustCalc.FMFR_SDC_Tires.value = new Decimal(game.tires.amount).round();

    ui.fmfr_starDustCalc.FMFR_SDC_PinLevel.value = new Decimal(game.supernova.pins.starPin).round();
    ui.fmfr_starDustCalc.FMFR_SDC_DustLevel.value = new Decimal(game.supernova.cosmicUpgrades.moreDust.level).round();

    ui.fmfr_import.statusText.innerHTML = "Done! (" + len + ", " + game.code + ")";
}