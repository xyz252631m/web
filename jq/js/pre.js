


$(function () {

    let $tab = $(".pre-tab a");
    $tab.on("click", function () {
        let idx = $tab.index(this);
        $tab.removeClass('active').eq(idx).addClass('active');
        $(".tab-main xmp").hide().eq(idx).show();
    })

});