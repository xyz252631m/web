mi.config.set("host", "http://localhost:3003/server/webFile/");
mi.define("init", async () => {
    let { Drop } = await mi.preload("drop", "./drop.js");
    let { Panel } = await mi.preload("panel", "./panel.js");
    mi.loadCss(mi.config.get("host") + "./tmpl/style.css", document);
    let drop = new Drop();
    let panel = new Panel();
    panel.addSetting();
    $(document).on("mousedown", function (e) {
        let el = e.target;
        // let fn = el.click;
        // $(el).off("click").on("click", function (e) {
        //
        //     console.log("click", e)
        // })
        console.log(document);
        drop.start(e);
    });
    $(document).on("mousemove", function (e) {
        drop.move(e);
    });
    $(document).on("mouseup", function (e) {
        drop.end(e);
    });
    $(document).on("mouseover", function (e) {
        let el = e.target;
        $(el).css({
            "box-shadow": "inset 1px 1px 1px #5cdaff, inset -1px -1px 1px #5cdaff"
        });
    });
    $(document).on("mouseout", function (e) {
        let el = e.target;
        $(el).css({
            "box-shadow": "none"
        });
    });
    drop.on("move", function (e) {
        // console.log("move", e)
    });
});
