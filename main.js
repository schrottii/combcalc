// copyright don't steal blablabla

// Reset is at 24:00 (summer, +2) / / 23:00 (winter, +1)

var date = new Date();
var serverDate;

var userTimezoneOffset = date.getTimezoneOffset() * 60000;

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "a very weird day"];
const FPS = 30;

var ui = {
    textGC: document.getElementById("textGC"),
}

function updateTime() {
    date = new Date();
    serverDate = new Date(date.getTime() + userTimezoneOffset + (2 * 60 * 60 * 1000));
    //now = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours() + 2, date.getUTCMinutes(), date.getUTCSeconds()));
    // this instead of new date to account for +2 time zone
}

function calculateGC() {
    let text = "";

    let isGC = Math.floor(((serverDate.getTime() + (2 * 60 * 60 * 1000)) / 1000 / 60 / 60 / 24) - 1) % 2;
    text = "Today is " + weekdays[serverDate.getDay()] + "."
        + "<br />Today the Global Challenge is <span style='font-size:32px; color:" + (isGC ? "lightgreen" : "red") + "'>" + (isGC ? "ACTIVE" : "INACTIVE") + "</span>!"
        + (isGC ? ("<br />It started " + serverDate.getHours() + " hours and " + serverDate.getMinutes() + " minutes ago.") :
        ("<br />It will start in " + (23 - serverDate.getHours()) + " hours and " + (59 - serverDate.getMinutes()) + " minutes."))
        + "<br /><br /><br />The server time is " + serverDate.toString().split(" GMT")[0] + "."
        + "<br />Reset is always at 22: 00 GMT + 0. (11 pm or midnight in Germany)";

    ui.textGC.innerHTML = text;
}

function loop() {
    updateTime();

    // UI update
    calculateGC();
}

setInterval(loop, 1000 / FPS);