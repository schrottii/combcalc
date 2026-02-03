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

var currentVersion = "v1.6";
var currentVersionDate = "(2026-)";
var patchNotes = `
-> Games and subcategories:
- Added support and UI for multiple games and subcategories
- Added Scrap Collector and SC2FMFR (and the already existing Scrap 2)
- Scrap 2 has these subcategories: GC/Combines, Scrap prod, Other, All
- Added images for all games and subcategories
- Overhauled structure and code to enable these, make it easier to add new tools, and optimize performance

-> New calcs and tools:
- SC2: Merge Pace Calc: get estimates for 1 hour, 6 hours, 12 hours, 1 day and 7 days based on merges in an FB and rest time, along with FB/h and hours per day info
- SCO: Prestige GS Calc: calculates GS on a prestige using the four relevant values
- SCO: Star Calc: calculates cost for a Star or multiple, including discount and the breakeven point
- SCO: Scrapyard Calc: calculates cost and effect at a given Scrapyard level
- SCO: Scrap Boost Calc: calculates the Scrap Boost at a number of collects, or how many are needed to get a certain boost
- FMFR: Second Dimension Calc: find out how many merges it takes for an optimal second dim run
- FMFR: Fairy Dust Calc: calculate current or theoretical gains by inserting all relevant numbers
- FMFR: Alien Dust Calc
- FMFR: Star Dust Calc
- FMFR: Import: paste your SC2FMFR save and the numbers are automatically extracted into the other calcs/tools, making it even easier

-> Other:
- Renamed Abstract <-> Scientific Calc to Abstract <-> Scientific Converter
- Barrel Production Calc appears for SC2FMFR too
- Changed color of squares at the bottom
`;

// PLANNED: fmfr calcs for 2nd dim, the three dusts, sc2 calc for pace, sc2 tool for barrels?

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

// UI DICT, most of it is auto generated when needed
var ui = {
    bottom: {
        header: document.getElementById("header"),
        patchNotes: document.getElementById("patchNotes"),
        currentVersion: document.getElementById("currentVersion")
    }
}

function normalizeScientific(mynum) {
    if (mynum.toString().includes("e")) return new Decimal(mynum);
    else return new Decimal("1e" + mynum);
}

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

    updateTools();
}

function init() {
    ui.bottom.header.innerHTML = "CombCalc " + currentVersion;
    updatePatchNotes();

    renderGames();
    renderCategories();

    setInterval(loop, 1000 / FPS);
}

init();