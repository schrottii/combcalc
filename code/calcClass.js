class Tool {
    constructor(html, ui, init, updater) {
        this.html = html;
        this.ui = ui;
        this.init = init;
        this.updater = updater;
    }
}

function renderTool(toolname) {
    if (selected[1] == "") return false;
    if (toolname == "all") return false;

    let tool = tools[toolname];

    ui[toolname] = {};
    let uiGrab = tool.ui;
    for (let ug of uiGrab) {
        if (ug.substr(0, 4) == "text") ui[toolname]["statusText"] = document.getElementById(ug);
        else ui[toolname][ug] = document.getElementById(ug);
    }

    tool.init();
    tool.updater();
}

function updateTool(toolname) {
    if (selected[1] == "") return false;
    if (toolname == "all") return false;
    if (tools[toolname] == undefined) console.log(toolname);

    tools[toolname].updater();
}

function renderTools() {
    document.getElementById("abcd").innerHTML = "";
    if (selected[1] == "") return false;

    let ltools = categories[selected[1]].contents;
    ltools = getAllToolsType(ltools);

    let render = "";
    for (let tool of ltools) {
        render += tools[tool].html;
    }
    document.getElementById("abcd").innerHTML = render;

    for (let tool of ltools) {
        renderTool(tool);
    }
}

function updateTools() {
    if (selected[1] == "") return false;

    let tools = categories[selected[1]].contents;
    tools = getAllToolsType(tools);

    for (let tool of tools) {
        updateTool(tool);
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