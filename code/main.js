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

var currentVersion = "v1.8";
var currentVersionDate = "(2026-09-20)";
var patchNotes = `
v1.8:
-> Merge Heatmap:
- Massive new tool that simulates merging from SC2 from the ground up, to track merges and then show optimal pos for Position Upgrades
- Includes the 20 barrels field (with the first 20 barrels of the game), merging & converting
- Results can show: Merges to, Merges from, Converts
- Top displays the amount of merges and converts (instead of Scrap and Magnets)

- Some extra tools to help you are included:
- Reset tracking (a hard reset that sets things like merges to 0)
- Clear all pos (sets all barrels to barrel 1, tracking is kept)
- Undo last step (reverts one merge, one convert, or one auto merge session)
- Fullscreen (makes it take up the entire screen like the web version of FMFR)
- Auto merge (simulated SC2's auto merge, can do 1 to 100000 merges at once, is included in tracking)

-> Merge Pattern Calc:
- New tool that explains patterns and tiers, and lets you figure out two things:
- How fast each repeat of the pattern has to be, to get a certain merge goal
- How many merges the FB will have, if every repeat takes a certain duration
- Additional milestones (up to 3s faster and 3s slower, so 7 numbers) will be shown in a table at the bottom

-> Barrel Production Calc:
- This tool is not only found under SC2 but also FR, because it works for both, however FR can have more factors. These can now be considered, with new options only visible when viewing it from the FR category.
- Stronger Barrel Tiers level (0 - 200, increases the 3^)
- Second Dimension toggle (1.1^ instead of 3^)

-> Subcategories:
- New Scrap 2 subcategory: Merging
- The only subcategories of Scrap Collector and SC2FMFR now say "(All)" to avoid confusion

-> Tool design:
- Result lines now blink yellow and have a slightly darker background
- Result lines now say Result: for easier finding and consistency
- Hover effect lingers for longer
- Images on the left are a bit smaller

-> Bottom boxes:
- Changed design a bit
- Moved Other Scrap content / wiki box into Info
- Turned legal links and Discord info into lists
- Added Latest patch notes headline
- Added dedicated box for Settings

-> Settings:
- Moved hard reset and tracker for optimized render updates (which is now more clear) here
- Added Setting to disable the new Result text flashing effect
- Added Setting to make tool boxes always wide (not expanding when hovered)
- Added Setting to perform all UI updates, even when unnecessary (see: v1.7.1)

-> Other:
- Added WGGJ v1.7 for the Merge Heatmap
- Improved initialization of tool texts
- Import tool: when something goes wrong, the text now gets updated & shows the save length
- Removed some exclamation marks so nobody thinks it could be an unexpected factorial
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

    },
    settings: {

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

function applyFlashyResultText() {
    // flashy results
    let newValue = getSetting("flashyResultText") === true ? "none" : "";
    let elementsArray = document.getElementsByClassName("toolResult");
    for (let em of elementsArray) {
        em.style.animation = newValue;
    }

    // full width boxes
    newValue = getSetting("fullWidthBoxes");
    elementsArray = document.getElementsByClassName("boxSize");
    for (let em of elementsArray) {
        em.style["margin-left"] = newValue ? "1%" : "";
        em.style["margin-right"] = newValue ? "1%" : "";
        em.style["max-width"] = newValue ? "98%" : "";
    }
}

function changeSetting(name, newValue = "toggle", defaultValue = "") {
    if (saveData.settings == undefined) saveData.settings = {};
    if (saveData.settings[name] == undefined) saveData.settings[name] = defaultValue;

    if (newValue != "toggle") {
        saveData.settings[name] = newValue;
    }
    else {
        // it's a toggle setting
        if (saveData.settings[name] === true) saveData.settings[name] = false;
        else if (saveData.settings[name] === false) saveData.settings[name] = true;
    }
}

function getSetting(name) {
    if (saveData.settings == undefined || saveData.settings[name] == undefined) return false;
    return saveData.settings[name];
}

function reloadSettings() {
    document.getElementById("setting-FlashyResultText").innerText = getSetting("flashyResultText") ? "Click to enable effects" : "Click to disable effects";
    document.getElementById("setting-FullWidthBoxes").innerText = getSetting("fullWidthBoxes") ? "Click to make boxes expendable again" : "Click to make boxes permanently wide";
    document.getElementById("setting-UnnecessaryUpdates").innerText = getSetting("unnecessaryUpdates") ? "Click to improve performance" : "Click to start force updating UI";

    applyFlashyResultText();
}

function toggleFlashyResultText() {
    changeSetting("flashyResultText", "toggle", true);
    reloadSettings();
}

function toggleUnnecessaryUpdates() {
    changeSetting("unnecessaryUpdates", "toggle", false);
    reloadSettings();
}

function toggleFullWidthBoxes() {
    changeSetting("fullWidthBoxes", "toggle", false);
    reloadSettings();
}


// LOOP
function loop() {
    updateTime();

    updateTools();

    document.getElementById("updatingData").innerHTML = necessaryUIUpdates + " updated, " + unnecessaryUIUpdates + " skipped (" + (unnecessaryUIUpdates / (necessaryUIUpdates + unnecessaryUIUpdates) * 100).toFixed(1)  + "% saved)";
}

function init() {
    saveLoadBackup();

    ui.bottom.header.innerHTML = "CombCalc " + currentVersion;
    updatePatchNotes();

    reloadSettings();

    renderGames();
    renderCategories();

    setInterval(loop, 1000 / FPS);
    setInterval(saveBackup, 3000);
}

init();

// wggj
images = {
    "barrel_1": "barrels/barrel_1.png",
    "empty": "barrels/empty.png",
    "barrels": "barrels/barrels.png",

    "merges": "merges.png",
    "converts": "converts.png",
    "reset": "reset.png",
    "clearfield": "clearfield.png",
    "undo": "undo.png",
    "results": "results.png",

    "mergefrompos": "mergefrompos.png",
    "mergetopos": "mergetopos.png",
    "convertpos": "convertpos.png",
}

var wggjIsStarted = false;
function resizeWGGJ() {
    wggj.canvas.pcWidthMulti = 0.45 / innerWidth * innerHeight;
    wggj.canvas.pcHeightMulti = 0.8;
    wggj.canvas.mobileWidthMulti = 0.45 / innerWidth * innerHeight;
    wggj.canvas.mobileHeightMulti = 0.8;
}

function startupWGGJ(name, targetCanvas = "wggjCanvas") {
    console.log("reassigning context");

    //document.getElementsByClassName("wggjCanvasFake").outerHTML = "";
    wggjCanvas = document.getElementById(targetCanvas);
    wggjCTX = wggjCanvas.getContext("2d");

    wggjCanvas.style.display = "";

    wggjCanvas.addEventListener("pointerdown", wggjEventsOnClick);
    wggjCanvas.addEventListener("pointerup", wggjEventsOnPointerUp);
    wggjCanvas.addEventListener("pointerleave", wggjEventsOnPointerUp);
    wggjCanvas.addEventListener("pointermove", wggjEventsOnPointerMove);

    //if (wggj.config.gameName != "") {
    //wggj.config.gameName = name;
    wggj.config.gameName = "CombCalc";
    wggj.config.font = "OpenSansBold";
    //wggj.config.startScene = "merging";
    wggj.config.imageBasePath = "images/scenes/";
    wggj.debug.scene = true;

    resizeWGGJ();

    if (wggjIsStarted == false) {
        wggjLoadImages();
        //wggjLoadAudio();
        wggjLoop();
        wggjIsStarted = true;
    }

    if (wggj.canvas.currentScene != name) loadScene(name);
    setTimeout(() => {
        if (objects["startTheGame"] != undefined) objects["startTheGame"].power = false;
    }, 200);
}