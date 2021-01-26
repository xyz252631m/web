


$(function () {

    let $tab = $(".pre-tab a");
    $tab.on("click", function () {
        let idx = $tab.index(this);
        $tab.removeClass('active').eq(idx).addClass('active');
        $(".tab-main xmp").hide().eq(idx).show();
    })

    var tool = {
    	    //数组 删除某项
            arrayDel: function(list, transformer){
                for (var i = list.length-1;i>=0;i--){
                    if(transformer(list[i])){
                        list.splice(i, 1);
                    }
                }
            }
    }

});