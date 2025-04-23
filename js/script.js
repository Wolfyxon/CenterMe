$(document).ready(() => {
    const player = $("#player");
    const target = $("#target");
    const properties = $("#editor-properties");
    
    function update() {
        const props = $(".editor-property");
        const vals = $(".editor-value");

        player.css({});

        props.each((i) => {
            player.css($(props[i]).val(), $(vals[i]).val());
        });

        const pRect = player[0].getBoundingClientRect();
        const tRect = target[0].getBoundingClientRect();
        
        if(
            pRect.left >= tRect.left && pRect.right <= tRect.right &&
            pRect.top >= tRect.top && pRect.bottom <= tRect.bottom
        ) {
            console.log("yay");
        }
    }

    function addProperty(property, value) {
        let pEnd = "";
        let vEnd = "";

        if(property) pEnd = "disabled";
        if(value) vEnd = "disabled";

        const propInp = $(`<input type="text" value="${property ?? ""}" class="editor-property" ${pEnd}>`);
        const valInp = $(`<input type="text" class="editor-value" value="${value ?? ""}" placeholder="..." ${vEnd}>`);

        propInp.on("input propertychange", update);
        valInp.on("input propertychange", update);
        
        properties.append(
            $("<div></div>")
            .append(propInp, ":", valInp)
        );
    }

    addProperty("margin");

    target.css({
        "margin": "0 auto"
    });
});