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

var currentVersion = "v1.9";
var currentVersionDate = "(2026-10-09)";
var patchNotes = `
-> Posupg Calc:
- Massive new tool (Other subcategory)
- Re-uses the heatmap's UI system, calculates costs of Position Upgrades
- Levels of the 4 Mastery Boosts and the Achievement Boost that reduce costs can be set
- Switch between tabs at the bottom, all 5 are available, with all 20 positions each

- Use the two buttons right above the positions to toggle between: setting currently owned levels, setting target levels
- Click on a position to set its level
- Use the Set all button in the top right to set levels for all 20 positions
- Use the (admittedly small) buttons on the left to set levels for all 4 positions in that row
- Owned level and target level are displayed on the positions (highlighted depending on current mode)
- Target level is +1 by default, set it to 0 to have +1 again
- When setting the target level for a single position, you can type it in the +100 format to base it off the owned level (it's inserted once, so when the owned level changes, this stays the same)

- The combined costs and amount of levels are displayed at the top
- Hover over a position to only see the costs and levels for that one
- Fullscreen option is available here as well
- You can enter how much of the currency you have and then it calculates the levels possible with that amount (even distribution), this does not overwrite your set levels/targets
- Automatically saves your levels & more! (Every time something gets calculated)
- Tab 3 getting Mastery Tokens back is not considered
- Special thanks to cubruce and Baydırman for the tab 1 cost formula past level 1000 (which was not listed anywhere, the other website & wiki both had it wrong)
- Special thanks to Mike9090 for suggesting this idea that definitely did not escalate

-> Storm Mastery Calc:
- New tool (Other subcategory)
- Enter start and end level to see how much a SM upgrade costs
- Enter level, progress and type of mastery (such as Wrench Storms) to see an approximation of how many items, storms & hours that is

-> Merge Heatmap:
- Merging no longer moves the barrel to the middle of the mouse, to be closer to SC2 than Fanmade
- Added setting at the bottom of the tool, if you wish to revert this change

-> Wiki:
- Added buttons leading to a relevant wiki article to a lot of tools, next to the Clear button
- Other Scrap content: replaced links to Global Challenge and Combine Tokens with a link to a list of all articles, because CombCalc has branched out a lot more by now

-> Share:
- Added buttons for sharing to all tools
- Click it to copy an URL for CombCalc that directly jumps to this tool when opened
- Useful to share a tool without the other person having to search for it

-> PWA:
- Added PWA support, meaning CombCalc can basically be "installed" on PC and mobile
- It works when offline, and auto updates when online
- It doesn't have the browser-own extra bars and buttons at the top/bottom
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

// share
var shareLocation = window.location.hash;
if (shareLocation.substr(0, 1) == "#") shareLocation = shareLocation.substr(1);

if (shareLocation !== "" && tools[shareLocation] != undefined) {
    for (let cat in categories) {
        if (categories[cat].contents.includes(shareLocation)) {
            clickCategory(cat);
            document.getElementById(shareLocation).scrollIntoView();
        }
    }
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

    "levels": "levels.png",
    "posx4": "posx4.png",

    "tab1": "tabs/tab1.png",
    "tab2": "tabs/tab2.png",
    "tab3": "tabs/tab3.png",
    "tab4": "tabs/tab4.png",
    "tab5": "tabs/tab5.png",
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