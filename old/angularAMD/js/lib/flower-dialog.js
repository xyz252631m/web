/**
 * @author wwei
 * @date 2015年12月08日
 * @version V1.0
 */

(function(window,angular){
    // defaults
    var defaults = {
        title: "提示",
        width: 350,
        height: 160,
        hasSetSize:false,      //宽和高是否可以在函数中修改
        hasTitle:true,
        hasMove: false,
        hasBorder: true,
        hasBtn: true,
        borWidth: 3,
        iframeWidth: "100%",
        iframeHeight: '160px',
        showShadeLayer: true,
        content: "", //直接显示此内容
        tipType: "",   //success error info custom confirm
        closeTxt: '关闭',
        close: function () { },    //右上角 and  关闭按钮的回调函数
        complete:function(){},
        submitTxt: '确定',
        submit: function () { } //确认的回调函数
    };
    function setSize(opts,width,height){
        if(opts.hasSetSize){
            if(width==0){
                return 'ng-style="{height:'+height+'+\'px\'}"';
            }
            if(height==0){
                return 'ng-style="{width:'+width+'+\'px\'}"';
            }
            return 'ng-style="{width:'+width+'+\'px\',height:'+height+'+\'px\'}"';
        }else{
            return "";
        }
    }
    var tool = {
        getTitle: function (opts,id) {
            var arrHtml = [];
            arrHtml.push(opts.showShadeLayer ? "<div id='shade" + id + "' class='alertbox-shade' style='z-index:"+(1000+id)+"'></div>" : "");
            arrHtml.push("<div id='box" + id + "' class='alertbox' "+setSize(opts,'(opt.width + opt.borWidth * 2 + 2)','(opt.height + opt.borWidth * 2 + 2)')+" style='width:" + (opts.width + opts.borWidth * 2 + 2) + "px;height:" + (opts.height + opts.borWidth * 2 + 2) + "px;z-index:"+((1000+id)+1)+"'>");
            if (opts.hasBorder) {
                arrHtml.push('<div class="box-bor" '+setSize(opts,'(opt.width + opt.borWidth * 2 + 2)','(opt.height + opt.borWidth * 2 + 2)')+' style="width:' + (opts.width + opts.borWidth * 2 + 2) + 'px;height:' + (opts.height + opts.borWidth * 2 + 2) + 'px;"></div>');
                arrHtml.push('<div class="box-con" '+setSize(opts,'opt.width','opt.height')+' style="width:' + opts.width + 'px;height:' + opts.height + 'px; top:' + opts.borWidth + 'px;left:' + opts.borWidth + 'px">');
            }else{
                arrHtml.push('<div class="box-con" '+setSize(opts,'opt.width','opt.height')+' style="border:none;width:' + opts.width + 'px;height:' + opts.height + 'px; top:' + opts.borWidth + 'px;left:' + opts.borWidth + 'px">');
            }

            if(opts.hasTitle) {
                arrHtml.push("<h3 dialog-move><span class='alertbox-close'><a class='close' ng-click='close()'>x</a></span>");
                arrHtml.push(opts.title);
                arrHtml.push("</h3>");
            }
            return arrHtml;
        },
        getBtn: function (opts) {
            if (opts.hasBtn) {
                if (opts.tipType == "error" || opts.tipType == "success" || opts.tipType == "info"||opts.tipType == "show") {
                    return "<div class='alert-info'><input type='button' class='box-btn-close' value='" + opts.closeTxt + "' ng-click='close()'/></div>";
                } else {
                    return "<div class='alert-btn'><input type='button' class='box-btn-close' value='" + opts.closeTxt + "' ng-click='close()'/><input class='box-btn-submit' ng-click='submit()' type='button' value='" + opts.submitTxt + "'/></div>"
                }
            }
        }
    };
    var flower ={
        //iframe
        iframe : function (url,opts,id) {
            var arrHtml = tool.getTitle(opts,id);
            arrHtml.push('<div class="alert-main"><iframe FRAMEBORDER="0" style="width:' + opts.iframeWidth + ';height:' + opts.iframeHeight + ';" src="');
            arrHtml.push(url + '"></iframe></div>');
            arrHtml.push(tool.getBtn(opts));
            arrHtml.push("</div>");
            return arrHtml.join("");
        },
        //success error info
        cusContent: function (opts,imgSrc,id) {
            var arrHtml = tool.getTitle(opts,id);
            var h=0;
            if(opts.hasTitle){
                h+=35;
            }
            if(opts.hasBtn){
                h+=45;
            }
            arrHtml.push("<div class='alert-main' "+setSize(opts,0,"(opt.height-"+h+")")+" style='height:"+(opts.height-h)+"px;'>");
            if(imgSrc){
                arrHtml.push("<img src='content/image/alertBox/"+imgSrc+"' width='70' height='70'/>");
            }
            if(opts.tipType=="template"){
                arrHtml.push("<span "+setSize(opts,"(opt.width - "+(imgSrc ? 110 : 0)+")",0)+"  style='width: " + (opts.width - (imgSrc ? 110 : 0)) + "px;display: block;margin:0'>");
            }else{
                arrHtml.push("<span  "+setSize(opts,"(opt.width - "+(imgSrc ? 110 : 30)+")",0)+" style='width: " + (opts.width - (imgSrc ? 110 : 30)) + "px;display: inline-block;'>");
            }

            arrHtml.push(opts.content);
            arrHtml.push('</span>');
            arrHtml.push('</div>');
            arrHtml.push(tool.getBtn(opts));
            arrHtml.push("</div></div>");
            return arrHtml.join("");
        },
        //close
        hide: function (id) {
            var box =document.getElementById("box" + id),shade=document.getElementById("shade" + id);
            if(box){
                var boxEle =  angular.element(box);
                boxEle.find(".close").unbind("click");
                boxEle.find(".box-btn-close").unbind("click");
                boxEle.find(".box-btn-submit").unbind("click");
                boxEle.remove();
                angular.element(shade).remove();
            }
        }
    };
    function initEvent(opts,id) {
        var w = angular.element(window);
        if (!opts.hasMove){
            w.on("resize",function () {
                initResize(opts,id);
            });
            w.on("scroll",function () {
                initResize(opts,id);
            });
        }
        initResize(opts,id);
        if(typeof(opts.complete)=="function"){
            opts.complete();
        }
    }
    function initResize(opts,id) {
        var box = document.getElementById("box" + id),width = document.documentElement.clientWidth,height =document.documentElement.clientHeight;
        if(box){
            var boxEle =  angular.element(box);
            boxEle.css({
                left: ((width - opts.width-opts.borWidth*2-2) / 2) + "px", top: ((height - opts.height-opts.borWidth*2-2)/3) + "px"
            });
        }
    }
    var app = angular.module('flowerDialog', []);
    app.directive("dialogMove",function(){
        var mx, my, ex, ey, IsDown = false;
        function up() {
            IsDown = false;
            try {
                angular.element(document.body).unbind("mousemove").unbind("mouseup");
            }catch(e){

            }
        };
        function move(rootElem, evt) {
            var width = rootElem[0].offsetWidth,height = rootElem[0].offsetHeight,moveX,moveY,windowWidth = document.documentElement.clientWidth,windowHeight =document.documentElement.clientHeight;
            if (IsDown) {
                moveX =  mx + evt.clientX -  ex;
                moveY =  my + evt.clientY -  ey;
                //width 边界
                if ((windowWidth -  mx - width) < (evt.clientX -  ex)) {
                    var c = windowWidth==window.screen.width?4:0;
                    moveX = windowWidth - width-c;
                }
                moveX = moveX < 0 ? 0 : moveX;
                //height 边界
                if ((windowHeight-  my - height) < (evt.clientY -  ey)) {
                    moveY = windowHeight - height;
                }
                moveY = moveY < 0 ? 0 : moveY;
                rootElem.css({
                    "left": moveX+"px", "top": moveY+"px"
                });
            }
        };
        return function(scope,elem){
            if(scope.opt.hasMove){
                elem.css("cursor", "move");
                elem.bind("mousedown",function(evt){
                    var rootElem =  elem.parent().parent();
                    var et = evt || event;
                    IsDown = true;
                    angular.element(document.body).bind("mousemove",function(evts){
                        move(rootElem,evts||event);
                    }).bind("mouseup", up);
                    ex = et.clientX;
                    ey = et.clientY;
                    mx = rootElem[0].offsetLeft;
                    my =rootElem[0].offsetTop
                    //my =rootElem[0].offsetTop - (window.pageYOffset||document.body.scrollTop);
                });
            }
        }
    });
    // 数组: 删除
    function arrayDel(list, idx) {
        if (idx < 0) {
            return list;
        } else {
            return list.slice(0, idx).concat(
                list.slice(idx + 1, list.length));
        }
    }

    // 数组: 查找索引
    function indexOf(list, item) {
        for (var i = 0, len = list.length; i < len; i++) {
            if (item === list[i]) {
                return i;
            }
        }
        return -1;
    }

    app.factory("dialog",["$compile","$document","$rootScope","$templateCache","$http","$q",function($compile,$document,$rootScope, $templateCache,$http,$q){
        var index = 1,idList=[];
        function getScope(){
            var scope = $rootScope.$new();
            index++;
            scope.idx=index;
            idList.push(index);
            scope.close=function(){
                scope.opt.close.call(scope.opt,scope);
                scope.$destroy();
                flower.hide(scope.idx);
                var temIdx = indexOf(idList,scope.idx);
                idList = arrayDel(idList,temIdx);
            };
            scope.submit=function(){
                scope.opt.submit.call(scope.opt,scope);
            };
            return scope;
        }
        function compileHtml(html,scope){
            $compile(html)(scope, function(contents) {
                $document.find("body").append(contents);
                initEvent(scope.opt,scope.idx);
            });
        }
        function extendMethod(scope){
            return {
                close:function(fn){
                    if(typeof(fn)==='function'){
                        scope.opt.close=fn
                    }
                    return this;
                },submit:function(fn){
                    if(typeof(fn)==='function'){
                        scope.opt.submit=fn;
                    }
                    return this;
                }
            };
        }
        function custom_dialog(initFn,options,promise){
            var scope =  getScope();
            scope.opt= angular.extend({},defaults);
            $q.when(promise,function(obj){
                if(typeof(initFn)==="object"&&typeof(options)==="undefined"){
                    options=initFn;
                }
                scope.opt = angular.extend(scope.opt,{content:obj.data,tipType:"custom"},options);
                if(typeof(initFn) === "function"){
                    initFn.call(scope.opt,scope);
                }
                var imgName={
                    custom:"",
                    show:"",
                    template:"",
                    confirm:"confirm.png",
                    success:"success.png",
                    error:"error.png",
                    info:"info.png"
                }
                if(scope.opt.tipType&&imgName[scope.opt.tipType]=="undefined"){
                    scope.opt.tipType="info";
                }
                var html =flower.cusContent(scope.opt,imgName[scope.opt.tipType],scope.idx);
                compileHtml(html,scope);
            },function(red){
                throw new Error(red.data);
            });
            return extendMethod(scope);
        }
        function joinType(type,opt){
            var opts = opt||{};
            if(!("tipType" in opts)){
                opts["tipType"]=type;
            }
            return opts;
        }
        return {
            allClose:function(){
                var temList = angular.copy(idList),temIdx;
                for(var i= 0,len=temList.length;i<len;i++){
                    flower.hide(temList[i]);
                    temIdx = indexOf(idList,temList[i]);
                    idList = arrayDel(idList,temIdx);
                }
            },
            success:function(msg,options){
                return custom_dialog(null,joinType("success",options),{data:msg});
            },
            error:function(msg,options){
                return custom_dialog(null,joinType("error",options),{data:msg});
            },
            info:function(msg,options){
                return custom_dialog(null,joinType("info",options),{data:msg});
            },
            confirm:function(msg,options){
                return custom_dialog(null,joinType("confirm",options),{data:msg});
            },
            show:function(msg,options){
                return custom_dialog(null,joinType("show",options),{data:msg});
            },
            custom:function(msg,initFn,options){
                return custom_dialog(initFn,options,{data:msg});
            },
            iframe:function(url,options){
                var scope =  getScope();
                scope.opt = angular.extend({},defaults,{url:url},options);
                var html = flower.iframe(url, scope.opt,scope.idx);
                return  compileHtml(html,scope);
            },
            template:function(url,initFn,options){
                var promise=true;
                if(url){
                    promise=$http.get(url, {cache: $templateCache});
                }
                return  custom_dialog(initFn,joinType("template",options),promise);
            },
            tool:{
                error:function(){
                    custom_dialog(null,joinType("error",null),{data:"请求失败！"});
                }
            }
        }
    }]);
})(window,window.angular);
