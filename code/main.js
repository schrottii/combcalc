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

var currentVersion = "v1.7";
var currentVersionDate = "(2026-07-31)";
var patchNotes = `
-> Saving:
- Inputs into the tools and calcs are now saved (every 3s)
- They get cached and later loaded directly into the tools when revisiting CombCalc
- Added buttons to quickly clear the inputs to most tools (top right)
- Added a button to clear ALL inputs of ALL tools to the Info section

-> Merge Pace Calc:
- Added ability to set a ratio, and the merges of the alt. speed
- This can be used for something like: 2:1 - 2 FBs, 1 am+fb
- Active Speed and Alt. Speed (if using ratio) are now shown (these are for active playing, so not including breaks)
- Seconds and Minutes are now shown
- Design and text changes

-> Other tools:
- SC2FMFR import: improved stability for lategame saves
- Renamed Abstract <-> Scientific Converter to Abstract-Scientific Converter

-> Design:
- Slightly changed hover effect for tools
- Changed positioning of tool images
- Increased size of checkboxes
- Increased size for categories and subcategories
- Limited patch notes height (scrollable)
- Various mobile improvements

-> Other:
- Removed old ToS and inserted new ToS, Balnoom License & Privacy Policy (note: not tailored to CombCalc, so it may be called a "game" or discuss contents that do not exist here)
- Contact: added E-mail (with mailto)
- Other Scrap content: Added link to SC2 Records
- Changed patch_notes.txt to PATCH_NOTES.md
- Added link to all patch notes
- Fixed very weird auto scrolling bug
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

// UI DICT, most of it is auto generated when needed
var ui = {
    bottom: {
        header: document.getElementById("header"),
        patchNotes: document.getElementById("patchNotes"),
        currentVersion: document.getElementById("currentVersion")
    }
}

var saveData = {
    userInputs: {

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

function saveSave() {
    let ssave = JSON.stringify(saveData);
    ssave = btoa(ssave);

    return ssave;
}

function saveLoad(ssave) {
    ssave = atob(ssave);
    ssave = JSON.parse(ssave);

    saveData = Object.assign({}, ssave);
}

function saveBackup() {
    for (let tool in tools) {
        tools[tool].saveUI();
    }

    localStorage.setItem("CombCalc", saveSave());
}

function saveLoadBackup() {
    let ssave = localStorage.getItem("CombCalc");
    if (ssave == null || ssave == undefined || ssave == false) return false;

    saveLoad(ssave);
}


// LOOP
function loop() {
    updateTime();

    updateTools();
}

function init() {
    saveLoadBackup();

    ui.bottom.header.innerHTML = "CombCalc " + currentVersion;
    updatePatchNotes();

    renderGames();
    renderCategories();

    setInterval(loop, 1000 / FPS);
    setInterval(saveBackup, 3000);
}

init();