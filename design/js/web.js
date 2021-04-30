//拖到的目标位置
let target = document.querySelector('.img-drag-box');
//dragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件
target.addEventListener('dragenter', function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.add('actived');
});
//dragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件
target.addEventListener('dragleave', function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.remove('actived');//移除actived类名
});
//dragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
target.addEventListener('dragover', function (e) {

    e.stopPropagation();
    e.preventDefault();
});

let counter = 1;
let img = {};
let imgList = [];
let list = [];
let tool = {
    addImg(file) {
        let fr = new FileReader();
        let name = file.name;
        let tem = imgList.find(d => d.name == name);
        if (tem) {
            console.warn("已存在图片", tem);
        }
        //οnlοad
        fr.onload = function (e) {
            let item = {
                id: counter++,
                name: name,
                cls: "",
                baseData: this.result,
                style: {
                    position: "absolute",
                    width: 0,
                    height: 0,
                    left: 0,
                    top: 0
                }
            }
            let _img = new Image();
            _img.src = this.result
            _img.onload = function () {
                console.log(this.width)
                item.style.width = this.width;
                item.style.height = this.height;
            }
            let tem = imgList.find(d => d.name == item.name);
            if (!tem) {
                img[item.id] = item;
                imgList.push(item);
            }

            tool.resetHtml();
        }
        fr.readAsDataURL(file);
    },

    resetHtml() {
        let h = [];
        imgList.forEach((d, i) => {
            let $el = $(`<div class="bg-${i}"></div>`)
            $el.css({
                width: d.style.width + 'px',
                height: d.style.height + 'px',
                left: d.style.left + 'px',
                top: d.style.top + 'px',
            })

            h.push($el);


        })


        $(target).append(...h)

    }
}
//进行放置 - drop
//当放置被拖数据时，会发生 drop 事件。
target.addEventListener('drop', function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.classList.remove('actived');

    if (e.dataTransfer.files.length) {
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            let file = e.dataTransfer.files.item(i);
            if (file.type === "image/png") {
                tool.addImg(file)

            }
            console.log("file", file)
            //type: "image/png"


        }


        return false;
    }
    // let uri = e.dataTransfer.getData('text/uri-list');
    // let text = e.dataTransfer.getData('text/plain');
    // console.log(uri,text)
    // if (uri) {//如果拖拽的是image
    //     let img = document.createElement('img');
    //     img.setAttribute('src', uri);
    //     target.appendChild(img);
    // } else if (text) {//如果拖拽的是text
    //     let textNode = document.createTextNode(text);
    //     target.appendChild(textNode);
    // }
});