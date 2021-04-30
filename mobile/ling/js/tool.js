angular.module('starter.tool', [])
  .factory("tool", function ($ionicLoading, $ionicPopup, $cordovaLocalNotification, $ionicPlatform) {
    return {
      showLoading: function () {
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: false,
          maxWidth: 200,
          showDelay: 0,
          duration: 5000
        });
      },
      hideLoading: function () {
        $ionicLoading.hide();
      },
      alert: function (msg, title) {
        this.showTip(msg, title);
        return $ionicPopup.alert({
          template: msg
        });
      },
      errInfo: function (msg) {
        return $ionicPopup.alert({
          title: 'error',
          template: '发生错误！' + msg
        });
      },
      lazyImg: function (scroll) {
        var l = 10, winH, scrH;
        var list = $("img[data-src]:visible");
        if (list.length) {
          winH = window.innerHeight;
          scrH = scroll.getScrollPosition().top;
        }
        var inH = function (num) {
          return (num - l >= scrH && num < (winH + scrH + l)) ? true : false;
        };
        list.each(function () {
          var o = $(this), pos = o.offset();
          var t = pos.top;
          var h = o.height();
          if (inH(t) || inH(t + h)) {
            //o.attr('src', o.attr('data-src'));
            var imgLoad = function (url, callback) {
              var img = new Image();
              img.src = url;
              if (img.complete) {
                callback(img.width, img.height);
              } else {
                img.onload = function () {
                  callback(img.width, img.height);
                  img.onload = null;
                };
              }
            };
            imgLoad(o.attr('data-src'), function (imgw, imgh) {
              o.attr('src', o.attr('data-src'));
              scroll.resize();
              // o.attr('width', imgw);
              //o.attr('height', imgh);
              o.removeAttr('data-src');
            });
          }
          if (!inH(t)) {
            o.attr('data-src', o.attr('src'));
            o.attr('src', o.attr('img/loading.gif'));
          }
        });
      },
      showTip: function (msg, title) {
        var str = "";
        if (typeof(msg) == "string") {
          str = msg;
        } else {
          str = JSON.stringify(msg);
        }
        if (localStorage["showTip"] == undefined) {
          localStorage["showTip"] = 1;
          localStorage["error"] = JSON.stringify([]);
        }
        if (parseInt((localStorage["showTip"]))) {
          var list = JSON.parse(localStorage["error"]);
          list.unshift(str);
          localStorage["error"] = JSON.stringify(list);
          $ionicPlatform.ready(function () {
            $cordovaLocalNotification.add({
              // id: "1234",
              //date: new Date(new Date().getTime() + 10 * 1000),
              message: str || "无详细信息",
              title: title || "提示",
              autoCancel: true,
              sound: null
            }).then(function () {
              //console.log("The notification has been set");
            });
          });
        }
        // var alarmTime = new Date();
        //alarmTime.setMinutes(alarmTime.getMinutes() + 1);
        //$cordovaLocalNotification.isScheduled("1234").then(function (isScheduled) {
        //  alert("Notification 1234 Scheduled: " + isScheduled);
        //});
      }
    }
  })
  .factory("check", function () {
    return {
      isAndroid: ionic.Platform.isAndroid(),
      isWin32: ionic.Platform.platform() == "win32",
      len: function (str) {
        var num = 0;
        var tem = str.split("");
        for (var i = 0; i < tem.length; i++) {
          if (tem[i].charCodeAt(0) < 299) {
            num++;
          } else {
            num += 2;
          }
        }
        return num;
      }
    }
  })
  .factory("pas", function () {
    return {
      int: function (str) { //string to int
        try {
          if (str) {
            return parseInt(str);
          } else {
            return 0;
          }
        } catch (e) {
          return 0;
        }
      },
      float: function (str) {//string to float
        try {
          if (str) {
            return parseFloat(str);
          } else {
            return 0;
          }
        } catch (e) {
          return 0;
        }
      }
    }
  })
  .factory("ajax", function ($http, check, lc, pas, tool) {
    return {
      get: function (url, option) {
        if (!option) {
          option = {};
        }
        option["isWeb"] = true;
        return $http.get(url, option).success(function (res) {
          var num = pas.float(lc.get("flow"));
          num += pas.float((check.len(res) / 3072).toFixed(2));
          lc.set("flow", num);
          //res = res.replace(/src/g, "data-src").replace(/script/g, "div").replace(/style/g, "div");
          return res;
        });
      },
      getCache: function (url, option) {
        $http.get(url, option);
      },
      post: function (url, data, option) {
        return $http.post(url, data, option).success(function (res) {
          var num = pas.float(lc.get("flow"));
          num += pas.float((check.len(res) / 3072).toFixed(2));
          lc.set("flow", num);
          res = res.replace(/src/g, "data-src");
          return res;
        });
      }
    }
  })
  .factory("qq", function ($http, tool, lc) {
    return {
      checkInstall: function (callback) {
        QQSDK.checkClientInstalled(function () {
          callback();
        }, function () {
          // if installed QQ Client version is not supported sso,also will get this error
          tool.alert("未检测到qq客户端！");
        });
      },
      //是否过期
      isExpires: function () {
        if (localStorage["et"]) {
          return Number(localStorage["et"]) < new Date().getTime()
        } else {
          return 1;
        }
      },
      login: function (callback) {
        QQSDK.ssoLogin(function (args) {
          var param = {
            access_token: args.access_token,
            oauth_consumer_key: "1105691376",
            openid: args.userid,
            format: "json"
          }
          localStorage["openid"] = args.userid;
          //get_simple_userinfo
          $http.get("https://graph.qq.com/user/get_simple_userinfo", {params: param}).success(function (res) {
            localStorage["info"] = JSON.stringify(res);
            callback(res);
          }).error(function (err) {
            tool.alert(err, "获取用户信息失败！");
          })
          //alert("token is " + args.access_token);
          //alert("userid is " + args.userid);
          //alert("expires_time is " + new Date(parseInt(args.expires_time)) + " TimeStamp is " + args.expires_time);
          localStorage["et"] = args.expires_time;
        }, function (failReason) {
          tool.alert(failReason, "qq by login");
        });
      },
      logout: function (callback) {
        QQSDK.logout(function () {
          localStorage["et"] = -1;
          callback();
        }, function (failReason) {
          tool.showTip(failReason, "qq by logout");
        });
      },
      getUserInfo: function () {
        //nickname	用户昵称。
        //figureurl	大小为30×30像素的QQ空间头像URL。
        //figureurl_1	大小为50×50像素的QQ空间头像URL。
        //figureurl_2	大小为100×100像素的QQ空间头像URL。
        //figureurl_qq_1	大小为40×40像素的QQ头像URL。
        //figureurl_qq_2	大小为100×100像素的QQ头像URL。
        //若没有100×100像素的QQ头像，则返回大小为40×40像素的QQ头像URL。
        //is_yellow_vip	标识用户是否为黄钻用户（0：不是；1：是）。
        //is_yellow_year_vip	标识用户是否为年费黄钻用户（0：不是；1：是）。
        //yellow_vip_level	黄钻等级。如果用户是黄钻用户，才返回该参数
        var objStr = localStorage["info"];
        if (objStr) {
          return JSON.parse(objStr);
        }
        return null;
      },
      //保存到云上
      saveBook: function () {
        //SecretId:AKID77KUTIIOeiaLvItfhaKZhcLYjjW7Hu2U
        //SecretKey:UowwKkAUdaPHG7n9Wlz5JPJ0sIcllY9n
        if(this.isExpires()){
          return ;
        }
        var bucket = "test";
        function getAuth() {
          var skey = 'UowwKkAUdaPHG7n9Wlz5JPJ0sIcllY9n';
          var random = parseInt(Math.random() * Math.pow(2, 32));
          var now = parseInt(new Date().getTime() / 1000);
          var e = now + 60 * 10; //签名过期时间为当前+60s
          var path = '';//多次签名这里填空
          // "a=[appid]&b=[bucket]&k=[SecretID]&e=[expiredTime]&t=[currentTime]&r=[rand]&f="
          var str = 'a=1251114761&b=test&k=AKID77KUTIIOeiaLvItfhaKZhcLYjjW7Hu2U&e=' + e + '&t=' + now + '&r=' + random +
            '&f=' + path + '';
          var sha1Res = CryptoJS.HmacSHA1(str, skey);//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
          var strWordArray = CryptoJS.enc.Utf8.parse(str);
          var resWordArray = sha1Res.concat(strWordArray);
          var res = resWordArray.toString(CryptoJS.enc.Base64);
          //res = encodeURIComponent(res);
          return res;
        }
        function cosAjax(url, data, callback, error) {
          $.ajax({
            url: url,
            type: "post",
            xhrFields: {
              withCredentials: true
            },
            dataType: "json",
            data: data,
            crossDomain: true,
            contentType: false, //必须
            processData: false,
            //jsonp: "jsoncallback",
            success: function (res) {
              callback && callback(res);
            }, error: function (err) {
              error && error(err);
            }
          });
        }
//http://test-1251114761.costj.myqcloud.com/ebook/69FE0EDB17C93FAF9948/bookshelf.json
        var newFolder = '/ebook/' + localStorage["openid"].toString().substring(0, 20) + "/";//填你需要创建的文件夹，记得用斜杠包一下
        var createFilder = function () {
          var param = new FormData();
          param.append("op", "create");
          cosAjax("http://tj.file.myqcloud.com/files/v2/1251114761/test" + newFolder + "?sign=" + getAuth(), param, function (res) {
            tool.showTip("创建目录成功!");
            uploadFile();
          }, function (err) {
            tool.showTip("创建目录失败!");
            tool.showTip(err);
          })
        }
        var uploadFile = function () {
          var param = new FormData();
          param.append("op", "upload");
          param.append("filecontent", JSON.stringify(lc.getBookshelf()));
          param.append("insertOnly", "0");
          cosAjax("http://tj.file.myqcloud.com/files/v2/1251114761/test" + newFolder + "/bookshelf.json?sign=" + getAuth(), param, function (res) {
            tool.alert("同步成功！");
          }, function () {
            tool.showTip("同步失败!");
          })
        }
        $.get("http://tj.file.myqcloud.com/files/v2/1251114761/test" + newFolder + "?sign=" + getAuth() + "&op=stat").success(function () {
          tool.showTip("获取目录成功!");
          uploadFile();
        }).error(function () {
          tool.showTip("获取目录失败!");
          createFilder();
        })
      },
      downBook: function (callback) {
        //http://test-1251114761.costj.myqcloud.com/ebook/69FE0EDB17C93FAF9948/bookshelf.json
        var url = "http://test-1251114761.costj.myqcloud.com/ebook/" + localStorage["openid"].toString().substring(0, 20) + "/bookshelf.json";
        $.get(url).success(function (res) {
          var list = JSON.parse(res);
          callback&&callback(list);
          //$.each(list, function () {
          //  lc.addBookshelf(this);
          //})
        }).error(function (err) {
          tool.alert("下载书架数据失败！");
          tool.showTip(err);
        });
      },
      synchroBook:function () {
        var self = this;
        this.downBook(function (list) {
          lc.addListBookshelf(list);
          self.saveBook();
        })
      }
    }
  })

