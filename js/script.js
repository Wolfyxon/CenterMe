$(document).ready(() => {
    const player = $("#player");
    const target = $("#target");
    const properties = $("#editor-properties");
    
    function addProperty(property, value) {
        let pEnd = "";
        let vEnd = "";

        if(property) pEnd = "disabled";
        if(value) vEnd = "disabled";

        const propInp = $(`<input type="text" value="${property ?? ""}" class="editor-property" ${pEnd}>`);
        const valInp = $(`<input type="text" class="editor-value" value="${value ?? ""}" placeholder="..." ${vEnd}>`);

        function update() {
            player.css(propInp.val(), valInp.val());
        }

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