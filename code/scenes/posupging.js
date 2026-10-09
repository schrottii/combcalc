var posupgCalcFactors = {
    mastery18: 0,
    mastery19: 0,
    mastery20: 0,
    mastery25: 0,
    achievementBoost: 0,
}

var posupgLevels = [
    [],
    [],
    [],
    [],
    []
];
var posupgTargets = [
    [],
    [],
    [],
    [],
    []
];
var posupgFakeTargets = [ // for calc based on currency amount
    [],
    [],
    [],
    [],
    []
];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 20; j++) {
        posupgLevels[i].push(0);
        posupgTargets[i].push(0);
        posupgFakeTargets[i].push(0);
    }
}

var posupgSelectedTab = 1;
var posupgLevelType = "owned"; // owned ~ target

var posupgFinishedCalculation = [0, 0];
var hoverSlot = -1;
var hoverTime = 0;

function calcPosupgReduction(type, level) {
    switch (type) {
        // Mastery 18 - Reduces Tab 4 costs by x0.9
        case "m18":
            return Math.pow(0.9, level);
        // Mastery 19 - Reduces Tab 5 costs by x0.96
        case "m19":
            return Math.pow(0.96, level);
        // Mastery 20 - Reduces Tab 2 costs by x0.96
        case "m20":
            return Math.pow(0.96, level);
        // Mastery 25 - Reduces Tab 3 costs by x0.985
        case "m25":
            return Math.pow(0.985, level);
        // Achievement Boost - Reduces ALL Tab costs by -0.2%
        case "achievementBoost":
            return 1 - (0.002 * level);
    }
}

function factorial(num) {
    let fnum = num;
    let f = num - 1;
    while (f > 1) {
        fnum *= f;
        f--;
    }
    return fnum;
}

function calcPosupgCost(tab, startLevel, endLevel = -1) {
    let price = 0;
    if (endLevel === -1) endLevel = startLevel + 1;

    // formulas are L - 1 to L
    startLevel += 1;
    endLevel += 1;

    switch (tab) {
        case 1:
            for (let l = startLevel; l < endLevel; l++) {
                if (l <= 400) price += Math.pow(10, 9) * l;
                else if (l <= 500) price += 1.05 * Math.pow(10, 9) * l;
                else if (l <= 1000) price += 1.05 * 1.2 * Math.ceil((l - 500) / 100) * Math.pow(10, 9) * l;
                //else price += 1.05 * Math.pow(Math.min(2, 1.2 + 0.1 * Math.floor((l - 1000) / 100)), Math.ceil((l - 500) / 100)) * Math.pow(10, 9) * l;
                else price += Math.pow(10, 9) * l * 1.05 * Math.pow(1.2, 6)
                    * (factorial(13 + Math.max(0, Math.ceil((Math.min(1700, l) - 1100) / 100)))
                        / (factorial(12) * Math.pow(10, 1 + Math.ceil((Math.min(1700, l) - 1100) / 100))))
                    * Math.pow(2, Math.max(0, Math.floor((l - 1700) / 100)));
            }

            price = price * calcPosupgReduction("achievementBoost", posupgCalcFactors.achievementBoost);
            break;

        case 2:
            for (let l = startLevel; l < endLevel; l++) {
                if (l <= 10) price += Math.pow(10, 4) * l;
                else if (Math.ceil(l / 10) % 2 == 0) price += Math.pow(10, 4) * l * Math.pow(2, Math.ceil(l / 20));
                else price += Math.pow(10, 4) * l * Math.pow(2, Math.ceil(l / 20)) * (3 / 4);
            }

            price = price * calcPosupgReduction("achievementBoost", posupgCalcFactors.achievementBoost) * calcPosupgReduction("m20", posupgCalcFactors.mastery20);
            break;

        case 3:
            for (let l = startLevel; l < endLevel; l++) {
                if (l <= 500) price += l;
                else price += l * Math.pow(2, (l - 500) / 100);
            }

            price = price * calcPosupgReduction("achievementBoost", posupgCalcFactors.achievementBoost) * calcPosupgReduction("m25", posupgCalcFactors.mastery25);
            break;

        case 4:
            for (let l = startLevel; l < endLevel; l++) {
                price += 2.5 * Math.pow(10, 6) * Math.pow(1.15, l - 1) * l;
            }

            price = price * calcPosupgReduction("achievementBoost", posupgCalcFactors.achievementBoost) * calcPosupgReduction("m18", posupgCalcFactors.mastery18);
            break;

        case 5:
            for (let l = startLevel; l < endLevel; l++) {
                price += Math.pow(10, 9) * Math.pow(1.075, l - 1) * l;
            }

            price = price * calcPosupgReduction("achievementBoost", posupgCalcFactors.achievementBoost) * calcPosupgReduction("m19", posupgCalcFactors.mastery19);
            break;
    }

    price = Math.floor(price);
    return price;
}

function posupgsCalcCosts() {
    let totalCost = new Decimal(0);
    let totalLevels = 0;

    if (isValid(posupgCalcFactors.howFar)) {
        // calculate based on currency amount
        [totalCost, totalLevels] = posupgsCalcCostsHowFar();
    }
    else {
        // default - calculate based on current levels and target levels
        for (let i = 0; i < 20; i++) {
            if (posupgTargets[posupgSelectedTab - 1][i] != 0 && posupgTargets[posupgSelectedTab - 1][i] < posupgLevels[posupgSelectedTab - 1][i]) posupgTargets[posupgSelectedTab - 1][i] = 0;
            totalCost = totalCost.add(calcPosupgCost(posupgSelectedTab, posupgLevels[posupgSelectedTab - 1][i], posupgTargets[posupgSelectedTab - 1][i] != 0 ? posupgTargets[posupgSelectedTab - 1][i] : posupgLevels[posupgSelectedTab - 1][i] + 1));
            totalLevels += posupgTargets[posupgSelectedTab - 1][i] != 0 ? posupgTargets[posupgSelectedTab - 1][i] - posupgLevels[posupgSelectedTab - 1][i] : 1;
        }
    }
    totalCost = totalCost.floor(); // break infinity inaccuracy

    posupgFinishedCalculation = [fn(totalCost), totalLevels];

    if (objects["counter"]) {
        objects["counter"].text = fn(totalCost);
        objects["counter2"].text = totalLevels;

        // auto save :-)
        if (saveData.posupgCalc == undefined) saveData.posupgCalc = {};
        saveData.posupgCalc.levels = posupgLevels;
        saveData.posupgCalc.targets = posupgTargets;
        saveData.posupgCalc.selectedTab = posupgSelectedTab;
        saveData.posupgCalc.finishedCalc = posupgFinishedCalculation;
    }
}

function posupgsCalcCostsHowFar() {
    let totalCost = new Decimal(0);
    let totalLevels = 0;

    let canBuy = true;
    let cheapestPos;
    let cheapestLvl;
    let allocatedCost = new Decimal(posupgCalcFactors.howFar);
    //console.log(allocatedCost, posupgCalcFactors.howFar);

    let levels = [];
    for (let i = 0; i < 20; i++) {
        levels.push(posupgLevels[posupgSelectedTab - 1][i]);
    }

    // go thru all 20 over and over again (100k cap for safety)
    // if not a single one of them can be upgraded, break
    while (canBuy == true && totalLevels < 100000) {
        cheapestPos = -1;
        cheapestLvl = -1;
        for (let i = 0; i < 20; i++) {
            if (levels[i] < cheapestLvl || cheapestLvl == -1) {
                cheapestLvl = levels[i];
                cheapestPos = i;
            }
        }

        if (totalCost.add(calcPosupgCost(posupgSelectedTab, levels[cheapestPos])).gt(allocatedCost)) {
            canBuy = false;
            continue;
        }

        totalCost = totalCost.add(calcPosupgCost(posupgSelectedTab, levels[cheapestPos]));
        totalLevels += 1;
        levels[cheapestPos] += 1;
    }

    if (totalLevels > 0) {
        //console.log(levels);
        for (let i = 0; i < 20; i++) {
            posupgFakeTargets[posupgSelectedTab - 1][i] = levels[i];
        }
    }

    //console.log(totalCost, totalLevels);
    return [totalCost, totalLevels];
}

function fn(num) {
    num = num.toString(); // justin case
    if (num.includes("+")) num = num.substr(0, num.indexOf("+")) + num.substr(num.indexOf("+"));
    if (Math.floor(Math.log10(num)) < 6) return num;

    if (num.includes(".") && num.indexOf(".") < 5) return num.substr(0, 5) + "e" + Math.floor(Math.log10(num));
    return num.substr(0, 1) + "." + num.substr(1, 3) + "e" + Math.floor(Math.log10(num));
}

var posx4timer = 0;

scenes["posupging"] = new Scene(
    () => {
        // Init
        createSquare("bg", 0, 0, 1, 1, "#A0D0AA");
        createSquare("bg2", 0, 0, 1, 0.125, "#24B13F");
        createSquare("bg3", 0, 1 - 0.125, 1, 0.125, "#24B13F");
        createSquare("bg4", 0, 0.96, 1, 0.04, "#0E8705");

        // stats at top
        createSquare("counter_bg", 0.05, 0.05, 0.4, 0.05, "#0F4B1B");
        createImage("counter_img", 0.05, 0.05, 0.05, 0.05, "tab1", { quadratic: true, centered: true });
        createText("counter", 0.05 + 0.2, 0.09, "0", { size: 32, color: "white", align: "center", maxW: 0.25 });

        createSquare("counter2_bg", 0.65, 0.05, 0.3, 0.05, "#0F4B1B");
        createImage("counter2_img", 0.65, 0.05, 0.05, 0.05, "levels", { quadratic: true, centered: true });
        createText("counter2", 0.65 + 0.15, 0.1, "0", { size: 44, color: "white", align: "center", maxW: 0.25 });

        // buttons at the bottom
        // texts are not defined via attachments here for offset
        createButton("bottom_btn_tab1", 0.025, 0.877, 0.15, 0.08, "#0E8705", (c) => {
            posupgSelectedTab = 1;
            groups["posupging_bottom_tabs"].set("color", "#0E8705");
            objects[c].color = "#137204";
            objects["counter_img"].image = "tab" + posupgSelectedTab;
            posupgsCalcCosts();
        }, { aImage: { image: "tab1" } });
        createText("bottom_btn_tab1_txt", 0.1, 0.99, "Tab 1", { size: 24, color: "white", align: "center" });

        createButton("bottom_btn_tab2", 0.225, 0.877, 0.15, 0.08, "#0E8705", (c) => {
            posupgSelectedTab = 2;
            groups["posupging_bottom_tabs"].set("color", "#0E8705");
            objects[c].color = "#137204";
            objects["counter_img"].image = "tab" + posupgSelectedTab;
            posupgsCalcCosts();
        }, { aImage: { image: "tab2" } });
        createText("bottom_btn_tab2_txt", 0.3, 0.99, "Tab 2", { size: 24, color: "white", align: "center" });

        createButton("bottom_btn_tab3", 0.425, 0.877, 0.15, 0.08, "#0E8705", (c) => {
            posupgSelectedTab = 3;
            groups["posupging_bottom_tabs"].set("color", "#0E8705");
            objects[c].color = "#137204";
            objects["counter_img"].image = "tab" + posupgSelectedTab;
            posupgsCalcCosts();
        }, { aImage: { image: "tab3" } });
        createText("bottom_btn_tab3_txt", 0.5, 0.99, "Tab 3", { size: 24, color: "white", align: "center" });

        createButton("bottom_btn_tab4", 0.625, 0.877, 0.15, 0.08, "#0E8705", (c) => {
            posupgSelectedTab = 4;
            groups["posupging_bottom_tabs"].set("color", "#0E8705");
            objects[c].color = "#137204";
            objects["counter_img"].image = "tab" + posupgSelectedTab;
            posupgsCalcCosts();
        }, { aImage: { image: "tab4" } });
        createText("bottom_btn_tab4_txt", 0.7, 0.99, "Tab 4", { size: 24, color: "white", align: "center" });

        createButton("bottom_btn_tab5", 0.825, 0.877, 0.15, 0.08, "#0E8705", (c) => {
            posupgSelectedTab = 5;
            groups["posupging_bottom_tabs"].set("color", "#0E8705");
            objects[c].color = "#137204";
            objects["counter_img"].image = "tab" + posupgSelectedTab;
            posupgsCalcCosts();
        }, { aImage: { image: "tab5" } });
        createText("bottom_btn_tab5_txt", 0.9, 0.99, "Tab 5", { size: 24, color: "white", align: "center" });

        createGroup("posupging_bottom_tabs", [
            "bottom_btn_tab1",
            "bottom_btn_tab2",
            "bottom_btn_tab3",
            "bottom_btn_tab4",
            "bottom_btn_tab5",
        ]);

        // toggle between owned levels and deep desires
        createButton("togglelevelmode_start", 0.15, 0.11, 0.32, 0.04, "#0E8705", () => {
            posupgLevelType = "owned";
            objects["togglelevelmode_start"].alpha = 1;
            objects["togglelevelmode_goals"].alpha = 0.5;
        }, { aText: { text: "Owned levels", size: 20, color: "white" }, alpha: 1 });

        createButton("togglelevelmode_goals", 0.53, 0.11, 0.32, 0.04, "#0E8705", () => {
            posupgLevelType = "target";
            objects["togglelevelmode_goals"].alpha = 1;
            objects["togglelevelmode_start"].alpha = 0.5;
        }, { aText: { text: "Target levels", size: 20, color: "white" }, alpha: 0.5 });

        // set all button
        createButton("setall_btn", 0.775, 0, 0.2, 0.05, "#0E8705", () => {
            let posLevels = prompt("Set all 20 pos to what level?");
            if (posLevels < 0 || posLevels > 1e5 || posLevels === null || posLevels === "") return;
            posLevels = parseInt(posLevels);

            if (posupgLevelType == "owned") {
                for (let i = 0; i < 20; i++) {
                    posupgLevels[posupgSelectedTab - 1][i] = posLevels;
                }
            }
            if (posupgLevelType == "target") {
                for (let i = 0; i < 20; i++) {
                    posupgTargets[posupgSelectedTab - 1][i] = posLevels;
                }
            }

            posupgsCalcCosts();
        }, { aText: { text: "Set all", size: 20, color: "white" } });

        // full screen me uwu
        createButton("fullscreen_btn", 0.025, 0, 0.2, 0.05, "#0E8705", () => {
            if (wggj.canvas.pcWidthMulti < 1) {
                wggjCanvas.style.display = "none";
                startupWGGJ("posupging", "wggjCanvas");
                wggj.canvas.pcWidthMulti = 1;
                wggj.canvas.pcHeightMulti = 1;
                wggj.canvas.mobileWidthMulti = 1;
                wggj.canvas.mobileHeightMulti = 1;
            }
            else {
                // back
                wggjCanvas.style.display = "none";
                startupWGGJ('posupging', 'wggjCanvasPosupgCalc');
            }
        }, { aText: { text: "Fullscreen", size: 20, color: "white" } });



        // generate the field
        for (let i = 0; i < 20; i++) {
            createButton("position_" + i,
                0.025 + ((i % 4) * 0.25), 0.15 + 0.15 * Math.floor(i / 4),
                MERGING_BARREL_W, MERGING_BARREL_H, "empty", (c) => {
                    if (posx4timer < 0.5) return;

                    let posLevel = prompt("Set this pos to what level?");
                    if (posLevel.substr(0, 1) == "+" && posupgLevelType == "target") posLevel = parseInt(posLevel.substr(1)) + posupgLevels[posupgSelectedTab - 1][objects[c].i];
                    if (posLevel < 0 || posLevel > 1e5 || posLevel === null || posLevel === "") return;
                    posLevel = parseInt(posLevel);

                    if (posupgLevelType == "owned") {
                        posupgLevels[posupgSelectedTab - 1][objects[c].i] = posLevel;
                    }
                    if (posupgLevelType == "target") {
                        posupgTargets[posupgSelectedTab - 1][objects[c].i] = posLevel;
                    }

                    posupgsCalcCosts();
                },
                {
                    quadratic: false,
                    //aText: { text: "", size: 32, color: "white" }
                });
            objects["position_" + i].i = i;

            objects["position_" + i].onHover = (c) => {
                if (hoverSlot == -1) {
                    let i = objects[c].i;
                    hoverSlot = i;
                    hoverTime = 0;

                    objects["counter"].text = fn(calcPosupgCost(posupgSelectedTab, posupgLevels[posupgSelectedTab - 1][i], posupgTargets[posupgSelectedTab - 1][i] != 0 ? posupgTargets[posupgSelectedTab - 1][i] : posupgLevels[posupgSelectedTab - 1][i] + 1));
                    objects["counter2"].text = posupgTargets[posupgSelectedTab - 1][i] != 0 ? posupgTargets[posupgSelectedTab - 1][i] - posupgLevels[posupgSelectedTab - 1][i] : 1;

                    objects[c].alpha = 0.66;
                }

                if (hoverSlot == objects[c].i) {
                    hoverTime = 0;
                }
            }

            // fix niche bug where quickly moving mouse out can leave one hovered
            wggjCanvas.onmouseleave = () => {
                if (wggj.canvas.currentScene == "posupging") {
                    hoverTime = 10;
                    wggj.mouse.x = 0;
                }
            }

            createText("positiontext_" + i, 0.025 + ((i % 4) * 0.25) + (MERGING_BARREL_W / 2), 0.15 + 0.15 * Math.floor(i / 4) + (MERGING_BARREL_H / 2) - 0.01, "", { size: 32, color: "white", alpha: 0.777 });
            createText("positionghost_" + i, 0.025 + ((i % 4) * 0.25) + (MERGING_BARREL_W / 2), 0.15 + 0.15 * Math.floor(i / 4) + (MERGING_BARREL_H / 2) + 0.03, "", { size: 32, color: "white", alpha: 0.777 });
        }

        // x4 set buttons
        for (let i = 0; i < 5; i++) {
            createButton("posx4" + i, 0, 0.15 + 0.15 * i + (MERGING_BARREL_H / 3), 0.025, 0.02, "posx4", (c) => {
                let posLevel = prompt("Set this row to what level?");
                posx4timer = 0;
                if (posLevel < 0 || posLevel > 1e5 || posLevel === null || posLevel === "") return;
                posLevel = parseInt(posLevel);

                if (posupgLevelType == "owned") {
                    for (let j = objects[c].i * 4; j < 4 + objects[c].i * 4; j++) {
                        posupgLevels[posupgSelectedTab - 1][j] = posLevel;
                    }
                }
                if (posupgLevelType == "target") {
                    for (let j = objects[c].i * 4; j < 4 + objects[c].i * 4; j++) {
                        posupgTargets[posupgSelectedTab - 1][j] = posLevel;
                    }
                }

                posupgsCalcCosts();
            }, { quadratic: false });
            objects["posx4" + i].i = i;
        }

        // start up
        objects["bottom_btn_tab" + (posupgSelectedTab)].color = "#137204";
        objects["counter_img"].image = "tab" + posupgSelectedTab;

        // load backup :-)
        if (saveData.posupgCalc != undefined) {
            if (saveData.posupgCalc.levels != undefined) posupgLevels = saveData.posupgCalc.levels;
            if (saveData.posupgCalc.targets != undefined) posupgTargets = saveData.posupgCalc.targets;
            if (saveData.posupgCalc.selectedTab != undefined) posupgSelectedTab = saveData.posupgCalc.selectedTab;
            if (saveData.posupgCalc.finishedCalc != undefined) posupgFinishedCalculation = saveData.posupgCalc.finishedCalc;
        }

        tools.posupgCalc.updater(); // reload values for the reductions (when they came from cache)
        posupgsCalcCosts();
    },
    (tick) => {
        for (let i = 0; i < 20; i++) {
            objects["positiontext_" + i].text = posupgLevels[posupgSelectedTab - 1][i];
            if (isValid(posupgCalcFactors.howFar)) {
                objects["positionghost_" + i].text = posupgFakeTargets[posupgSelectedTab - 1][i];
            }
            else {
                objects["positionghost_" + i].text = posupgTargets[posupgSelectedTab - 1][i] != 0 ? posupgTargets[posupgSelectedTab - 1][i] : "(+1)";
            }
        }

        if (posupgLevelType == "owned") {
            for (let i = 0; i < 20; i++) {
                objects["positiontext_" + i].alpha = 1;
                objects["positionghost_" + i].alpha = 0.5;
            }
        }
        if (posupgLevelType == "target") {
            for (let i = 0; i < 20; i++) {
                objects["positiontext_" + i].alpha = 0.5;
                objects["positionghost_" + i].alpha = 1;
            }
        }

        posx4timer += tick;
        hoverTime += tick;

        // reset the "hovering over a position" effect
        if (hoverTime > 0.2 && hoverSlot != -1) {
            objects["position_" + hoverSlot].alpha = 1;
            hoverSlot = -1;

            objects["counter"].text = posupgFinishedCalculation[0];
            objects["counter2"].text = posupgFinishedCalculation[1];
        }
    }
);