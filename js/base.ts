/// global xui
// if (!window.xui) {
//     window.xui = {};
// }

const loader = {
    use(name: string, url: string) {

    },
    loader(url: string, callback?: Function) {

    },
    define(nameList, callback) {

    }
}


function loadJS(url, callback) {
    var script = document.createElement('script');
    var fn = callback || function () {

    };
    script.type = 'text/javascript';

    //IE
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                fn();
            }
        };
    } else {
        //其他浏览器
        script.onload = function () {
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);

}

