$(document).ready(() => {
    const player = $("#player");
    const playerVis = $("#player-visual");
    const target = $("#target");
    const area = $("#area");
    const editorsContainer = $("#editors");
    
    const areaRect = $("#area")[0].getBoundingClientRect();
    
    const editors = [];
    
    const playerEditor = addEditor(player, "#player");
    const areaEditor = addEditor(area, "#area");

    const levels = 2;
    let currentLevel = 0;

    function update() {
        editors.forEach(applyEdits);

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
            console.log("yay");
        }
    }

    function applyEdits(editor) {
        const props = editor.propElements;
        const vals = editor.valElements;

        editor.target.css({});

        props.forEach((prop, i) => {
            editor.target.css(prop.val(), vals[i].val());
        });
    }

    function addProperty(editor, property, value) {
        let pEnd = "";
        let vEnd = "";

        if(property) pEnd = "disabled";
        if(value) vEnd = "disabled";

        const propInp = $(`<input type="text" value="${property ?? ""}" class="editor-property" ${pEnd}>`);
        const valInp = $(`<input type="text" class="editor-value" value="${value ?? ""}" placeholder="..." ${vEnd}>`);

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
            propElements: [],
            valElements: []
        }

        editorsContainer.append(main);
        editors.push(editor);
        
        return editor;
    }

    function loadLevel(level) {
        editors.forEach((e) => e.propContainer.empty());
        target.css({});

        currentLevel = level;

        switch(level) {
            case 1: {
                addProperty(playerEditor, null, "0 auto");

                target.css({
                    "margin": "0 auto"
                });

                break;
            }

            case 2: {
                addProperty(areaEditor, "display", "flex");
                addProperty(areaEditor, null, "center");

                target.css({
                    "margin": "0 auto"
                });
                
                break;
            }
        }
    }

    loadLevel(1);
});