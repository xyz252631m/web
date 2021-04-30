function getImg(idx) {
    var canvas = document.getElementById('canvas');
    var c = canvas.getContext('2d');
    //新建Image对象
    var img = new Image();
    img.src = '../images/icon_bg.png';//svg内容中可以有中文字符
    var y = parseInt(idx / 12);
    var x = idx % 12;
    var imgs = new Image();
    $(imgs).css({
        'vertical-align': '-9px'
    })
    //图片初始化完成后调用
    var canvas2 = document.createElement("canvas")
    var cxt2 = canvas2.getContext("2d")
    img.onload = function () {
        //将canvas的宽高设置为图像的宽高
        canvas.width = img.width;
        canvas.height = img.height;
        //canvas画图片
        c.drawImage(img, 0, 0);
        var dataImg = c.getImageData(x * 30 +5+ 6, y * 30 + 5+6, 20, 20);

        //
        // var pixel = dataImg.data;
        //
        // var r=0, g=1, b=2,a=3;
        // for (var p = 0; p<pixel.length; p+=4)
        // {
        //     if (
        //         pixel[p+r] == 255 &&
        //         pixel[p+g] == 255 &&
        //         pixel[p+b] == 255) // if white then change alpha to 0
        //     {pixel[p+a] = 0;}
        // }


        canvas2.width = 20;
        canvas2.height = 20;
        cxt2.putImageData(dataImg, 0, 0, 0, 0, canvas2.width, canvas2.height)
        imgs.src = canvas2.toDataURL("image/png");
    }
    return imgs;
}
var img = getImg(idx);
$("#msg_input").append(img)