// copyright don't steal blablabla

// Reset is at 24:00 (summer, +2) / / 23:00 (winter, +1)

var date = new Date();
var serverDate;
var isSummerTime = true;
var serverTimeOffset = 2;

var userTimezoneOffset = date.getTimezoneOffset() * 60000;

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "a very weird day"];
const FPS = 30;

var ui = {
    textGC: document.getElementById("textGC"),
}

function updateTime() {
    date = new Date();
    serverDate = new Date(date.getTime() + userTimezoneOffset + (2 * 60 * 60 * 1000));
    // ^change 2 to play with the time

    isSummerTime = serverDate.getMonth() >= 3 && serverDate.getMonth() < 10;
    serverTimeOffset = isSummerTime ? 2 : 1;

    // ignore this:
    //now = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours() + 2, date.getUTCMinutes(), date.getUTCSeconds()));
    // this instead of new date to account for +2 time zone
}

function calculateGC() {
    let text = "";

    let isGC = (Math.floor(((serverDate.getTime() + userTimezoneOffset) / 1000 / 60 / 60) + 2) / 24) % 2;
    text = "Today is " + weekdays[serverDate.getDay()] + "."
        + "<br />Today the Global Challenge is <span style='font-size:32px; color:" + (isGC ? "lightgreen" : "red") + "'>" + (isGC ? "ACTIVE!" : "INACTIVE!") + "</span>"
        + (isGC ? ("<br />It started " + serverDate.getHours() + " hours and " + serverDate.getMinutes() + " minutes ago.") :
        ("<br />It will start in " + (23 - serverDate.getHours()) + " hours and " + (59 - serverDate.getMinutes()) + " minutes."))
        + "<br /><br /><br />The server time is " + serverDate.toString().split(" GMT")[0] + " (GMT+" + serverTimeOffset + ")."
        + "<br />Reset is always at 22:00 GMT + 0. (Currently " + (isSummerTime ? "midnight" : "11 P.M.") + " for Germany/the server)";

    ui.textGC.innerHTML = text;
}

function loop() {
    updateTime();

    // UI update
    calculateGC();
}

setInterval(loop, 1000 / FPS);