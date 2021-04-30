let config = {};

function initSizeAttr() {
    let list = [
        {name: "type"},
        {name: "width"},
        {name: "height"},
        {name: "top"},
        {name: "left"},
        {name: "scaleX"},
        {name: "scaleY"}
    ];
    $("#attr1").find(".panel-main").html(templateForm(list));
}

function templateForm(list) {
    let h = '';
    list.forEach(function (d) {
        h += `<div class="field is-grouped">
                <label class="label">${d.name}</label>
                <div class="control">
                    <input type="text" class="input is-small is-info">
                </div>
            </div>`;
    });
    // list.forEach(function (d) {
    //     h += `<p class="d-flex"><label  class="col-form-label">${d.name}</label><input type="text" class="form-control form-control-sm "></p>`;
    // });
    return h;
}


function init() {

    initSizeAttr();
}