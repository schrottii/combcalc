var necessaryUIUpdates = 1;
var unnecessaryUIUpdates = 0;

class Tool {
    constructor(html, displayName, iconImage, wikiArticle, ui, init, updater) {
        this.html = html;
        this.displayName = displayName;
        this.iconImage = iconImage;
        this.wikiArticle = wikiArticle;
        this.ui = ui;
        this.init = init;
        this.updater = updater;

        this.toolname = "";
        this.UIUpdateCache = {};
    }

    generateHTML() {
        return `
        <img src="images/${this.iconImage}" class="boxImg" />
        <div class="box boxSize" id="${this.displayName}">
        <h3 style="width: 100%; background-color: #18005b; margin-top: 0px; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;">
        <span style="grid-column: 2;"> ${this.displayName}</span> <span style="display: flex; grid-column: 3; justify-self: end;">`
            + `<button class="boxButton" onclick="shareTool('${this.displayName}')">Share</button>`
            + (this.ui.length > 1 ? `<button class="boxButton" onclick="clearTool('${this.displayName}')">Clear</button>` : "")
            + (this.wikiArticle !== "" ? `<button class="boxButton" onclick="window.open('` + "https://official-scrap-2.fandom.com/wiki/" + this.wikiArticle.replaceAll(" ", "_") + `');">Wiki</button>` : "")
            + "</span></h3>"
            + this.html + "</div>";
    }

    render() {
        ui[this.toolname] = {};
        let uiGrab = this.ui;
        for (let ug of uiGrab) {
            if (ug.substr(0, 4) == "text") ui[this.toolname]["statusText"] = document.getElementById(ug);
            else ui[this.toolname][ug] = document.getElementById(ug);
        }

        this.init(); // custom function to establish things
        this.initUI();
        this.updater(); // custom function called every update
        necessaryUIUpdates++;
    }

    initUI() {
        if (saveData.userInputs[this.toolname] == undefined) saveData.userInputs[this.toolname] = {};
        if (ui[this.toolname] == undefined) return false;

        if (document.getElementById(this.displayName) && this.toolname !== "") {
            document.getElementById(this.displayName).id = this.toolname;
        }

        for (let uie of this.ui) {
            if (uie.substr(0, 4) !== "text") {
                if (saveData.userInputs[this.toolname][uie] == undefined) saveData.userInputs[this.toolname][uie] = {};

                // set standard checked/value and then load cached if exists
                if (ui[this.toolname][uie].checked != undefined) {
                    ui[this.toolname][uie]["ui-standard-checked"] = ui[this.toolname][uie].checked;
                    if (saveData.userInputs[this.toolname][uie].checked) {
                        ui[this.toolname][uie].checked = saveData.userInputs[this.toolname][uie].checked;
                    }
                }
                if (ui[this.toolname][uie].value != undefined) {
                    ui[this.toolname][uie]["ui-standard-value"] = ui[this.toolname][uie].value;
                    if (saveData.userInputs[this.toolname][uie].value) {
                        ui[this.toolname][uie].value = saveData.userInputs[this.toolname][uie].value;
                    }
                }
            }
        }
    }

    saveUI() {
        if (saveData.userInputs[this.toolname] == undefined) saveData.userInputs[this.toolname] = {};
        if (ui[this.toolname] == undefined) return false;

        for (let uie of this.ui) {
            if (uie.substr(0, 4) !== "text") {
                if (saveData.userInputs[this.toolname][uie] == undefined) saveData.userInputs[this.toolname][uie] = {};

                if (ui[this.toolname][uie].checked != undefined) {
                    saveData.userInputs[this.toolname][uie].checked = ui[this.toolname][uie].checked;
                }
                if (ui[this.toolname][uie].value != undefined) {
                    saveData.userInputs[this.toolname][uie].value = ui[this.toolname][uie].value;
                }
            }
        }

    }

    clear() {
        //console.log("hello from " + this.displayName);
        //console.log(this.ui);
        if (ui[this.toolname] == undefined) return false;

        for (let uie of this.ui) {
            if (uie.substr(0,4) !== "text") {
                //console.log(ui[this.toolname][uie], ui[this.toolname][uie]["ui-standard-value"]);
                if (ui[this.toolname][uie]["ui-standard-value"] != undefined) {
                    ui[this.toolname][uie].value = ui[this.toolname][uie]["ui-standard-value"];
                }
                if (ui[this.toolname][uie]["ui-standard-checked"] != undefined) {
                    ui[this.toolname][uie].checked = ui[this.toolname][uie]["ui-standard-checked"];
                }
            }
        }
        this.updater();
    }

    checkUpdate() {
        let hasAnythingChanged = false;
        for (let uie of this.ui) {
            if (uie.substr(0,4) !== "text") {
                // compare
                if (this.UIUpdateCache[uie] != undefined) {
                    if (this.UIUpdateCache[uie].value != ui[this.toolname][uie].value || this.UIUpdateCache[uie].checked != ui[this.toolname][uie].checked) {
                        // something did happen
                        //console.log(this.UIUpdateCache[uie].value, ui[this.toolname][uie].value, this.UIUpdateCache[uie].checked, ui[this.toolname][uie].checked);
                        hasAnythingChanged = true;
                        //break; - not allowed due to update below
                    }
                    // else ... nothing ever happens
                }
                else this.UIUpdateCache[uie] = {}; // we are a newborn, so nothing to compare yet, setup for next step (update - in this case, inserting values for the first time)

                // update
                this.UIUpdateCache[uie].value = ui[this.toolname][uie].value;
                this.UIUpdateCache[uie].checked = ui[this.toolname][uie].checked;
            }
        }

        if (hasAnythingChanged || getSetting("unnecessaryUpdates")) {
            necessaryUIUpdates++;
            this.updater();
        }
        else unnecessaryUIUpdates++;
    }
}

function clearTool(displayName) {
    for (let tool in tools) {
        if (tools[tool].displayName == displayName || displayName === "all") {
            tools[tool].clear();
            if (displayName !== "all") break;
        }
    }
}

function shareTool(displayName) {
    for (let tool in tools) {
        if (tools[tool].displayName == displayName) {
            let url = window.location.toString();
            if (url.includes("#")) url = url.split("#")[0]; // if you already got here via share, don't keep that bit
            url = url + "#" + tools[tool].toolname;

            navigator.clipboard.writeText(url);
            alert("Copied link to this tool to clipboard:\n" + url);
            break;
        }
    }
}

function renderTool(toolname) {
    if (selected[1] == "") return false;
    if (toolname == "all") return false;

    if (tools[toolname].toolname === "") {
        // init-like thing
        tools[toolname].toolname = toolname;
    }

    tools[toolname].render();
}

function updateTool(toolname) {
    if (selected[1] == "") return false;
    if (toolname == "all") return false;
    if (tools[toolname] == undefined) console.log(toolname);

    tools[toolname].checkUpdate();
}

function renderTools() {
    document.getElementById("abcd").innerHTML = "";
    if (selected[1] == "") return false;

    let ltools = categories[selected[1]].contents;
    ltools = getAllToolsType(ltools);

    let render = "";
    for (let tool of ltools) {
        render += tools[tool].generateHTML();
    }
    document.getElementById("abcd").innerHTML = render;

    for (let tool of ltools) {
        renderTool(tool);
    }
    applyFlashyResultText();
}

function updateTools() {
    if (selected[1] == "") return false;

    let tools = categories[selected[1]].contents;
    tools = getAllToolsType(tools);

    for (let tool of tools) {
        //console.time("updating tool" + tool);
        updateTool(tool);
        //console.timeEnd("updating tool" + tool);
    }
}

function getAllToolsType(tools) {
    if (tools[0] == "all") {
        tools = [];
        for (let cat in games[selected[0]].contents) {
            if (categories[games[selected[0]].contents[cat]].contents[0] == "all") continue;
            tools.push(...categories[games[selected[0]].contents[cat]].contents);
        }
    }
    return tools;
}