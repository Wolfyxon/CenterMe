$(document).ready(() => {
    const player = $("#player");
    const playerVis = $("#player-visual");
    
    const target = $("#target");

    const area = $("#area");
    const areaRect = $("#area")[0].getBoundingClientRect();
    
    const editorsContainer = $("#editors");
    const editors = [];
    
    const playerEditor = addEditor(player, "#player");
    const areaEditor = addEditor(area, "#area");

    const levelDisp = $("#level-disp");
    const progress = $(".progress");
    const progressBar = $(".progress-bar");

    const levels = [
        () => {
            addProperty(playerEditor, null, "0 auto");
            centerTarget();
        },
        () => {
            addProperty(areaEditor, "display", "flex");
            addProperty(areaEditor, null, "center");

            centerTarget();
        },
        () => {
            addProperty(areaEditor, "display", "flex");
            addProperty(areaEditor, "flex-direction", "column");
            addProperty(playerEditor, null, "center");

            centerTarget();
        },
        () => {
            addProperty(areaEditor, "display");
            addProperty(areaEditor, "place-items");
            
            target.css({
                "margin": "auto"
            });
        },
        () => {
            addProperty(areaEditor, "display");
            addProperty(areaEditor, null, "center");

            target.css({
                "margin": "auto 0"
            });
        },
        () => {
            resetDimensions(player);

            addProperty(playerEditor, "position");
            addProperty(playerEditor, null, 0);
            addProperty(playerEditor, null, 0);
            
            target.css({
                "right": "0",
                "bottom": "0",
                "top": "unset",
                "left": "unset"
            });
        }
    ];

    let currentLevel = 0;
    let win = false;



    function updatePlayer() {
        const pRect = player[0].getBoundingClientRect();
        
        playerVis.css({
            "left": pRect.left - areaRect.left,
            "top": pRect.top - areaRect.top
        });
    }

    function update() {
        if(win) return;

        editors.forEach(applyEdits);
        updatePlayer();

        const pRect = player[0].getBoundingClientRect();
        const tRect = target[0].getBoundingClientRect();
        
        playerVis.css({
            "left": pRect.left - areaRect.left,
            "top": pRect.top - areaRect.top
        });
        
        if(
            pRect.left >= tRect.left && pRect.right <= tRect.right &&
            pRect.top >= tRect.top && pRect.bottom <= tRect.bottom
        ) {
            win = true;
            area.css("background-color", "var(--bs-green)");
            
            setTimeout(() => {
                if(!loadNextLevel()) {
                    win = false;
                }
            }, 1000);
        }
    }

    function applyEdits(editor) {
        const props = editor.propElements;
        const vals = editor.valElements;

        //editor.target.removeAttr("style");

        editor.lastProps.forEach((prop) => {
            editor.target.css(prop, "");
        });

        editor.lastProps = [];

        props.forEach((prop, i) => {
            const val = vals[i];

            if(!val || !val.val()) return;
            if(!prop.val()) return;

            editor.target.css(prop.val(), val.val());
            editor.lastProps.push(prop.val());
        });
    }

    function addProperty(editor, property, value) {
        let pEnd = "";
        let vEnd = "";

        if(property != null) pEnd = "disabled";
        if(value != null) vEnd = "disabled";

        const propInp = $(`<input type="text" value="${property ?? ""}" class="editor-property" placeholder="Property..." ${pEnd}>`);
        const valInp = $(`<input type="text" class="editor-value" value="${value ?? ""}" placeholder="Value..." ${vEnd}>`);

        if(property != null) propInp.addClass("locked");
        if(value != null) valInp.addClass("locked");

        propInp.on("input propertychange", update);
        valInp.on("input propertychange", update);

        editor.propElements.push(propInp);
        editor.valElements.push(valInp);

        editor.propContainer.append(
            $("<div></div>")
            .append(propInp, ":", valInp)
        );
    }

    function addEditor(target, dispSelector) {
        const main = $(`
            <div class="editor" class="flex-fill">
                <span class="editor-selector">${dispSelector}</span> { <br>
                <div class="editor-properties"></div>
                }
            </div>
        `);
        
        const editor = {
            target: target,
            element: main,
            propContainer: main.find(".editor-properties"),
            lastProps: [],
            propElements: [],
            valElements: []
        }

        editorsContainer.append(main);
        editors.push(editor);
        
        return editor;
    }

    function centerTarget() {
        target.css({
            "margin": "0 auto"
        });
    }

    function resetDimensions(elm) {
        elm.css({
            "top": "unset",
            "bottom": "unset",
            "left": "unset",
            "right": "unset"
        });
    }

    function loadLevel(level) {
        editors.forEach((e) => {
            e.propContainer.empty();
            e.propElements = [];
            e.valElements = [];
        });

        area.css("background-color", "black");
        
        target.removeAttr("style");
        player.removeAttr("style");
        playerVis.removeAttr("style");
        
        win = false;

        levelDisp.text(`${level + 1}/${levels.length}`);
        progressBar.css("width", `${((level + 1) / levels.length) * 100}%`);
        progress.attr("area-valuenow", level + 1);
        
        currentLevel = level;
        levels[level]();
        
        editors.forEach((e) => {
            if(e.propElements.length == 0) {
                e.propContainer.append($("<span class='text-secondary'>/* Empty */</span>"));
            }
        });

        update();
        updatePlayer();
    }

    function loadNextLevel() {
        if(currentLevel < levels.length - 1) {
            loadLevel(currentLevel + 1);
            return true;
        }

        return false;
    }

    $("#btn-prev-level").click(() => {
        if(win) return;

        if(currentLevel > 0) {
            loadLevel(currentLevel - 1);
        }
    });

    $("#btn-next-level").click(() => {
        if(win) return;

        loadNextLevel();
    });

    progress.attr("aria-valuemax", levels.length);
    loadLevel(0);
});