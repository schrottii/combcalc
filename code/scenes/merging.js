var merging = {};
var undo_automerge = {};
var allowOutOfBounds = false;

const MERGING_BARREL_W = 0.2;
const MERGING_BARREL_H = 0.12;

function resetMergingTracking() {
    merging = {
        mode: "merge",

        dragBarrel1: -1,
        dragBarrel2: -1,
        tier1: -1,
        tier2: -1,

        convertPos: -1,
        convertTimer: -1,

        merges: 0,
        converts: 0,
        fails: 0,

        mergefrompos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        mergetopos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        convertpos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        failpos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

        undo: {
            action: "none",
            pos1: -1,
            pos2: -1,
            data1: -1,
            data2: -1
        }
    };
}
resetMergingTracking();

function resetMergingBarrels() {
    console.log(allowOutOfBounds);
    if (merging.dragBarrel1 != -1) {
        objects["position_" + merging.dragBarrel1].w = MERGING_BARREL_W;
        objects["position_" + merging.dragBarrel1].h = MERGING_BARREL_H;
        objects["position_" + merging.dragBarrel1].config.foreground = false;
    }

    merging.dragBarrel1 = -1;
    merging.dragBarrel2 = -1;
    merging.tier1 = -1;
    merging.tier2 = -1;
}

function resetMergingField() {
    for (let i = 0; i < 20; i++) {
        objects["position_" + i].tier = 1;
    }
}

function mergingUndo() {
    // undo one merge
    if (merging.undo.action == "merge") {
        objects["position_" + merging.undo.pos1].tier = merging.undo.data1;
        objects["position_" + merging.undo.pos2].tier = merging.undo.data2;

        merging.merges -= 1;
        merging.mergefrompos[merging.undo.pos1] -= 1;
        merging.mergetopos[merging.undo.pos2] -= 1;

        merging.undo.action = "none";
    }

    // undo one convert
    if (merging.undo.action == "convert") {
        objects["position_" + merging.undo.pos1].tier = merging.undo.data1;

        merging.converts -= 1;
        merging.convertpos[merging.undo.pos1] -= 1;

        merging.undo.action = "none";
    }

    // undo an entire series of unfortunate events
    if (merging.undo.action == "automerge") {
        merging = Object.assign({}, undo_automerge);
        for (let i = 0; i < 20; i++) {
            objects["position_" + i].tier = undo_automerge.barrels[i];
        }
        undo_automerge = {};
    }
}

function mergingShowResults(source = "mergetopos") {
    merging.mode = "results";

    objects["result_btn_mergesto"].color = (source == "mergetopos") ? "#137204" : "#0E8705";
    objects["result_btn_mergesfrom"].color = (source == "mergefrompos") ? "#137204" : "#0E8705";
    objects["result_btn_converts"].color = (source == "convertpos") ? "#137204" : "#0E8705";

    let highestHEAT = 0;
    for (let heat of merging[source]) {
        if (heat > highestHEAT) highestHEAT = heat;
    }

    for (let i = 0; i < 20; i++) {
        objects["bgheat" + i + ":text"].text = merging[source][i];
        objects["bgheat" + i].alpha = merging[source][i] / highestHEAT;
    }

    groups["bottom_btns"].set("power", false);
    setTimeout(() => groups["result_btns"].set("power", true), 200);
}

function mergingHideResults() {
    merging.mode = "merge";

    for (let i = 0; i < 20; i++) {
        objects["bgheat" + i + ":text"].text = "";
        objects["bgheat" + i].alpha = 0;
    }

    groups["result_btns"].set("power", false);
    setTimeout(() => groups["bottom_btns"].set("power", true), 200);
}

function mergingUpdateBarrels() {
    for (let i = 0; i < 20; i++) {
        objects["position_" + i].snip = [(objects["position_" + i].tier - 1) * 64, 0, 64, 64];

        if (objects["position_" + i].moved === true) {
            objects["position_" + i].moved = false;
            merging.fails++;
            merging.failpos[i]++;

            createAnimation("position_" + i + "_moveback", "position_" + i, (t, d) => {
                if (t.x > t.startx) t.x -= (t.x - t.startx + 0.06) * d * 6;
                if (t.x < t.startx) t.x += (t.startx - t.x + 0.06) * d * 6;
                if (t.y > t.starty) t.y -= (t.y - t.starty + 0.06) * d * 6;
                if (t.y < t.starty) t.y += (t.starty - t.y + 0.06) * d * 6;
            }, 0.6, true);
        }
        if (objects["position_" + i].moved == "merged") {
            objects["position_" + i].moved = false;

            objects["position_" + i].x = objects["position_" + i].startx;
            objects["position_" + i].y = objects["position_" + i].starty;
        }
    }
}

function merge(automerge = false) {
    //console.log("merge");

    // undo
    if (automerge == false) {
        merging.undo.action = "merge";
        merging.undo.pos1 = merging.dragBarrel1;
        merging.undo.pos2 = merging.dragBarrel2;
        merging.undo.data1 = merging.tier1;
        merging.undo.data2 = merging.tier2;
    }

    // do the merge
    merging.merges++;
    merging.mergefrompos[merging.dragBarrel1]++;
    merging.mergetopos[merging.dragBarrel2]++;

    // increase my tier +1, reset the other to empty / spawn tier
    objects["position_" + merging.dragBarrel2].tier++;
    objects["position_" + merging.dragBarrel1].tier = 1;
    objects["position_" + merging.dragBarrel1].moved = "merged";

    // animation
    createAnimation("position_" + merging.dragBarrel2 + "_tierup", "position_" + merging.dragBarrel2, (t, d, a) => {
        t.w = Math.min(MERGING_BARREL_W, a.dur * 0.6);
        t.h = Math.min(MERGING_BARREL_H, a.dur * 0.5);

        t.x = t.startx + (MERGING_BARREL_W - t.w) / 2;
        t.y = t.starty + (MERGING_BARREL_H - t.h) / 2;
    }, 0.5, true);
}

function automerge(amount = 1) {
    let allPositionsFull = false;
    let mergesDone = 0;

    while (mergesDone < amount && allPositionsFull == false) {
        for (let i = 1; i <= 20; i++) {
            if (i == 20) {
                allPositionsFull = true;
                break;
            }
            for (let j = 0; j < i; j++) {
                if (objects["position_" + j].tier == objects["position_" + i].tier) {
                    merging.dragBarrel1 = i;
                    merging.dragBarrel2 = j;
                    merging.tier1 = objects["position_" + i].tier;
                    merging.tier2 = objects["position_" + j].tier;

                    merge(true);
                    mergesDone++;

                    i = 1;
                    break;
                }
            }

            if (mergesDone >= amount) break;
        }
    }

    mergingUpdateBarrels();
}

function moveBarrelToMiddle() {
    // this was the default in v1.8, now it is an optional setting if you want it back
    return ui.mergeHeatmap.heatmapMiddleBarrel.checked || false;
}

scenes["merging"] = new Scene(
    () => {
        // Init
        createSquare("bg", 0, 0, 1, 1, "#A0D0AA");
        createSquare("bg2", 0, 0, 1, 0.125, "#24B13F");
        createSquare("bg3", 0, 1 - 0.125, 1, 0.125, "#24B13F");
        createSquare("bg4", 0, 0.96, 1, 0.04, "#0E8705");

        // stats at top
        createSquare("counter_bg", 0.05, 0.05, 0.3, 0.05, "#0F4B1B");
        createImage("counter_img", 0.05, 0.05, 0.05, 0.05, "merges", { quadratic: true, centered: true });
        createText("counter", 0.05 + 0.15, 0.1, "0", { size: 44, color: "white", align: "center" });

        createSquare("counter2_bg", 0.65, 0.05, 0.3, 0.05, "#0F4B1B");
        createImage("counter2_img", 0.65, 0.05, 0.05, 0.05, "converts", { quadratic: true, centered: true });
        createText("counter2", 0.65 + 0.15, 0.1, "0", { size: 44, color: "white", align: "center" });

        // buttons at the bottom
        // texts are not defined via attachments here for offset
        createButton("bottom_btn_reset", 0.025, 0.877, 0.2, 0.08, "#0E8705", () => {
            allowOutOfBounds = true;
            if (confirm("Do you want to hard reset tracking?\n(Barrels stay)")) resetMergingTracking();
            allowOutOfBounds = false;
        }, { aImage: { image: "reset" } });
        createText("bottom_btn_reset_txt", 0.125, 0.99, "Reset tracking", { size: 24, color: "white", align: "center" });

        createButton("bottom_btn_clearfield", 0.275, 0.877, 0.2, 0.08, "#0E8705", () => {
            allowOutOfBounds = true;
            if (confirm("Do you want to hard reset the barrel field?\n(Tracking stays)")) resetMergingField();
            allowOutOfBounds = false;
        }, { aImage: { image: "clearfield" } });
        createText("bottom_btn_clearfield_txt", 0.375, 0.99, "Clear all pos", { size: 24, color: "white", align: "center" });

        createButton("bottom_btn_undo", 0.525, 0.877, 0.2, 0.08, "#0E8705", () => {
            mergingUndo();
        }, { aImage: { image: "undo" } });
        createText("bottom_btn_undo_txt", 0.625, 0.99, "Undo last step", { size: 24, color: "white", align: "center" });

        createButton("bottom_btn_results", 0.775, 0.877, 0.2, 0.08, "#0E8705", () => {
            mergingShowResults();
        }, { aImage: { image: "results" } });
        createText("bottom_btn_results_txt", 0.875, 0.99, "See results", { size: 24, color: "white", align: "center" });

        createGroup("bottom_btns", [
            "bottom_btn_reset", "bottom_btn_reset_txt",
            "bottom_btn_clearfield", "bottom_btn_clearfield_txt",
            "bottom_btn_undo", "bottom_btn_undo_txt",
            "bottom_btn_results", "bottom_btn_results_txt"
        ]);

        // bottom buttons but for results mode
        createButton("result_btn_mergesto", 0.025, 0.877, 0.2, 0.08, "#0E8705", () => {
            mergingShowResults("mergetopos");
        }, { aImage: { image: "mergetopos" } });
        createSmartText("result_btn_mergesto_txt", 0.125, 0.98, "Merges to\n(Tab 1, 2, 5)", { size: 24, color: "white", align: "center" });

        createButton("result_btn_mergesfrom", 0.275, 0.877, 0.2, 0.08, "#0E8705", () => {
            mergingShowResults("mergefrompos");
        }, { aImage: { image: "mergefrompos" } });
        createSmartText("result_btn_mergesfrom_txt", 0.375, 0.98, "Merges from\n(Tab 3)", { size: 24, color: "white", align: "center" });

        createButton("result_btn_converts", 0.525, 0.877, 0.2, 0.08, "#0E8705", () => {
            mergingShowResults("convertpos");
        }, { aImage: { image: "convertpos" } });
        createSmartText("result_btn_converts_txt", 0.625, 0.98, "Converts\n(Tab 4)", { size: 24, color: "white", align: "center" });

        createButton("result_btn_return", 0.775, 0.877, 0.2, 0.08, "#0E8705", () => {
            mergingHideResults();
        }, { aImage: { image: "barrel_1" } });
        createText("result_btn_return_txt", 0.875, 0.99, "Done", { size: 24, color: "white", align: "center" });

        createGroup("result_btns", [
            "result_btn_mergesto", "result_btn_mergesto_txt",
            "result_btn_mergesfrom", "result_btn_mergesfrom_txt",
            "result_btn_converts", "result_btn_converts_txt",
            "result_btn_return", "result_btn_return_txt"
        ]);
        groups["result_btns"].set("power", false);

        // auto merge button
        createButton("automerge_btn", 0.775, 0, 0.2, 0.05, "#0E8705", () => {
            allowOutOfBounds = true;
            let amount = prompt("How many merges to perform?\n(1 - 100000)");
            if (isNaN(amount) || amount === false || amount === undefined || amount === null) return;
            amount = parseInt(amount);
            //if (amount < 1 || amount > 100000) return;
            if (amount < 1) amount = 1;
            if (amount > 100000) amount = 100000;

            // prepare undo (undoing auto merge is done by reverting to the previous state, rather than a git-like approach... easier)
            undo_automerge = Object.assign({}, merging);
            undo_automerge.barrels = [];
            // save the barrel tiers (usually attached to the objects, but we cant do that here can we)
            for (let i = 0; i < 20; i++) {
                undo_automerge.barrels.push(objects["position_" + i].tier);
            }
            // assign the arrays within the undo, so they are not bound to the normal arrays anymore
            for (let i in undo_automerge) {
                if (undo_automerge[i].length != undefined && merging[i] != undefined) {
                    undo_automerge[i] = Object.assign([], merging[i]);
                }
            }
            merging.undo.action = "automerge";

            // 200ms delay to start auto merge
            setTimeout(() => {
                automerge(amount);
                allowOutOfBounds = false;
            }, 200);
        }, { aText: { text: "Auto merge", size: 20, color: "white" } });

        // full screen me uwu
        createButton("fullscreen_btn", 0.025, 0, 0.2, 0.05, "#0E8705", () => {
            if (wggj.canvas.pcWidthMulti < 1) {
                wggjCanvas.style.display = "none";
                startupWGGJ("merging", "wggjCanvas");
                wggj.canvas.pcWidthMulti = 1;
                wggj.canvas.pcHeightMulti = 1;
                wggj.canvas.mobileWidthMulti = 1;
                wggj.canvas.mobileHeightMulti = 1;
            }
            else {
                // back
                wggjCanvas.style.display = "none";
                startupWGGJ('merging', 'wggjCanvasMergeHeatmap');
            }
        }, { aText: { text: "Fullscreen", size: 20, color: "white" } });



        // generate the field
        for (let i = 0; i < 20; i++) {
            createImage("bgpos" + i,
                0.025 + ((i % 4) * 0.25), 0.15 + 0.15 * Math.floor(i / 4),
                MERGING_BARREL_W, MERGING_BARREL_H, "empty");

            createButton("position_" + i,
                0.025 + ((i % 4) * 0.25), 0.15 + 0.15 * Math.floor(i / 4),
                MERGING_BARREL_W, MERGING_BARREL_H, "barrels", (c) => {
                    // onclick handles convert
                    if (merging.mode != "merge") return;
                    if (merging.convertPos == objects[c].i && merging.convertTimer <= 0.360) {
                        // performs a convert
                        merging.undo.action = "convert";
                        merging.undo.pos1 = objects[c].i;
                        merging.undo.data1 = objects[c].tier;

                        objects[c].tier = 1;

                        merging.converts++;
                        merging.convertpos[objects[c].i]++;

                        // UI update / animation
                        objects[c].moved = false;
                        mergingUpdateBarrels();
                        createAnimation("convert" + objects[c].i, c, (t, d) => t.alpha -= 5 * d, 0.2, false);
                    }
                    merging.convertPos = objects[c].i;
                    merging.convertTimer = 0;
                },
                {
                    snip: [0, 0, 64, 64],
                    quadratic: false,
                    onDrag: (c) => {
                        // pick me up!
                        if (merging.mode != "merge") return;
                        if (merging.dragBarrel1 == -1) {
                            // let everyone know who I am and my tier
                            merging.dragBarrel1 = objects[c].i;
                            merging.tier1 = objects[c].tier;

                            // size increase
                            objects[c].w = MERGING_BARREL_W * 1.2;
                            objects[c].h = MERGING_BARREL_H * 1.2;
                            objects[c].config.foreground = true;
                        }

                        // while dragging, I move with the mouse
                        if (merging.dragBarrel1 == objects[c].i) {
                            if (!moveBarrelToMiddle()) {
                                if (objects[c].moved == false) {
                                    // initial setting of the offset compared to barrel middle
                                    objects[c].mouseOffsetX = (wggj.mouse.x / wggj.canvas.w) - objects[c].x - (objects[c].w / 2);
                                    objects[c].mouseOffsetY = (wggj.mouse.y / wggj.canvas.h) - objects[c].y - (objects[c].h / 2);
                                    console.log(objects[c].mouseOffsetX);
                                }

                                objects[c].x = (wggj.mouse.x / wggj.canvas.w) - objects[c].w / 2 - objects[c].mouseOffsetX;
                                objects[c].y = (wggj.mouse.y / wggj.canvas.h) - objects[c].h / 2 - objects[c].mouseOffsetY;
                            }
                            else {
                                // old (jumps to middle of mouse)
                                objects[c].x = (wggj.mouse.x / wggj.canvas.w) - objects[c].w / 2;
                                objects[c].y = (wggj.mouse.y / wggj.canvas.h) - objects[c].h / 2;
                            }
                            objects[c].moved = true;
                        }
                    },
                    onUp: (c) => {
                        if (merging.mode != "merge") return;
                        if (merging.dragBarrel1 == objects[c].i) {
                            // if dragging onto myself do nothing, avoid running twice, AND if I get dragged onto an empty bg stop the drag
                            setTimeout(() => {
                                if (merging.dragBarrel2 == -1) resetMergingBarrels();
                            }, 10);
                            return;
                        }

                        // code from here only executed on the target (dragged onto)
                        // set me as the second barrel
                        merging.dragBarrel2 = objects[c].i;
                        merging.tier2 = objects[c].tier;
                        //console.log(merging);

                        // is the merge good? (valid barrels, same tier, not the same barrel)
                        if (merging.dragBarrel1 != -1 && merging.dragBarrel2 != -1 && merging.tier1 == merging.tier2 && merging.dragBarrel1 != merging.dragBarrel2) {
                            // successful merge! ONTO ME :3
                            merge();
                        }

                        resetMergingBarrels();
                    }
                });

            // setup where I am and starting tier
            objects["position_" + i].moved = false;
            objects["position_" + i].i = i;
            objects["position_" + i].tier = 1;
            objects["position_" + i].startx = objects["position_" + i].x;
            objects["position_" + i].starty = objects["position_" + i].y;

            createSquare("bgheat" + i,
                0.025 + ((i % 4) * 0.25), 0.15 + 0.15 * Math.floor(i / 4),
                MERGING_BARREL_W, MERGING_BARREL_H, "#FF0000", {
                    alpha: 0,
                    aText: { text: "", size: 64, color: "white" }
            });
        }

        createButton("onUp_overlay", 0, 0, 1, 1, "empty", () => { }, {
            alpha: 0, power: true,
            onUp: () => {
                mergingUpdateBarrels();
            },
            onMouseMove: () => {
                // if the mouse moves too fast, onDrag might not catch up with it
                // this fix here fixes it
                if (merging.dragBarrel1 != -1 && wggj.mouse.down) {
                    let me = objects["position_" + merging.dragBarrel1];
                    if (!me.isHit(wggj.mouse.x, wggj.mouse.y)) {
                        me.x = (wggj.mouse.x / wggj.canvas.w) - me.w / 2;
                        me.y = (wggj.mouse.y / wggj.canvas.h) - me.h / 2;
                    }
                }
            }
        });

        // semi fix for draggint outta screen
        wggjCanvas.onmouseout = () => {
            if (!allowOutOfBounds) resetMergingBarrels();
        };

        // start up
        mergingUpdateBarrels();
    },
    (tick) => {
        // Loop
        objects["counter"].text = merging.merges;
        objects["counter2"].text = merging.converts;

        objects["bottom_btn_undo"].power = merging.undo.action != "none" && merging.mode == "merge";
        objects["bottom_btn_undo_txt"].power = merging.undo.action != "none" && merging.mode == "merge";

        merging.convertTimer += tick;
    }
);