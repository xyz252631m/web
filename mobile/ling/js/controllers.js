angular.module('starter.controllers', [])
  .run(function ($rootScope, $ionicPlatform, $ionicPopup, $cordovaFile, check, bookTypeList, lc, pas, $state, $http, tool) {
    //lc.set(lc.name.type, "test");
    $rootScope.isFull = false;
    $rootScope.skin = "";
    $rootScope.tab = function (idx) {
      if (idx == 0) {
        $state.go("tab.index");
      }
    }
    $rootScope.$on('$cordovaLocalNotification:click',
      function (event, notification, state) {
        $state.go('tab.error');
      });
    var startNum = pas.int(lc.get("startNum"));//启动次数
    if (!startNum) {
      //初始化一级目录
      $ionicPlatform.ready(function () {
        if (!check.isWin32) {
          var item, key;
          for (key in bookTypeList) {
            if (bookTypeList.hasOwnProperty(key)) {
              item = bookTypeList[key];
              (function (name) {
                $cordovaFile.checkDir(cordova.file.dataDirectory, name).then(function () {
                }, function () {
                  $cordovaFile.createDir(cordova.file.dataDirectory, name, false)
                    .then(function (success) {
                      // success
                    }, function (error) {
                      $ionicPopup.alert({template: "创建缓存" + name + "目录(一级)失败"});
                    });
                })
              })(item.name);
            }
          }
        }
      });
    }
    startNum++;
    lc.set("startNum", startNum);
  })
  .controller('DashCtrl', function ($scope) {
  })
  .controller('jokeCtrl', function ($scope) {
  })
  //TODO : yuedu
  .controller('yueduCtrl', function ($scope, $rootScope, $state, $stateParams, ajax, $ionicGesture, $window, $ionicScrollDelegate, lc, books, tool, catalog, $ionicLoading, $ionicPopup, $cacheFactory) {
    $rootScope.isFull = true;
    //lingbar.hide();
    var urlCache = $cacheFactory.get("url-cache");
    if (!urlCache) {
      $cacheFactory("url-cache", {capacity: 3});
    }
    var bookType = books.getType();
    var bid = $stateParams.bid, cid = $stateParams.cid;
    var lc_sett = lc.get("setting");
    if (lc_sett) {
      $scope.style = JSON.parse(lc_sett);
    } else {
      $scope.style = {
        height: "auto",
        fontSize: "14px",
        lh: 1.2
      }
    }
    $scope.isSetting = false;
    $scope.setting = {
      font: [{name: "小", num: 12},
        {name: "较小", num: 14},
        {name: "中", num: 16},
        {name: "较大", num: 18},
        {name: "大", num: 20}],
      bg: [{color: "#F6F4EC", active: 0},
        {color: "#DBEED9", active: 0},
        {color: "#E8FDFE", active: 0},
        {color: "#F6F6F6", active: 0},
        {color: "#DED6D6", active: 0},
        {color: "#FDD9D9", active: 0},
        {color: "#666", c: "#999", active: 0}],
      lh: [1.0, 1.2, 1.4, 1.6, 1.8]
    };
    //set font
    $scope.setFont = function (font) {
      angular.forEach($scope.setting.font, function (item) {
        item.active = 0;
      });
      font.active = 1;
      $scope.style.fontSize = font.num + "px";
      $scope.style.height = "auto";
      lc.set("setting", JSON.stringify($scope.style));
      temView = null;
    }
    //set bg
    $scope.setBg = function (bg) {
      angular.forEach($scope.setting.bg, function (item) {
        item.active = 0;
      });
      bg.active = 1;
      $scope.style.backgroundColor = bg.color;
      if (bg.c) {
        $scope.style.color = bg.c;
      }
      lc.set("setting", JSON.stringify($scope.style));
    }
    //set lineHeight
    $scope.setlh = function (lh) {
      $scope.style.lineHeight = lh + "em";
      lc.set("setting", JSON.stringify($scope.style));
    }
    var book = {typeId: bookType.id, bookId: bid, chapterId: cid};
    if (~$stateParams.typeId) {
      book.typeId = $stateParams.typeId;
    }
    var isBookshelf = lc.existBook(book);
    if (isBookshelf) {
      var b_type = books.getNameByTypeId(isBookshelf.typeId);
      if (b_type) {
        lc.set(lc.name.type, b_type.name);
        bookType = books.getType();
      }
    }
    //获取内容
    var getContent = function (bid, cid) {
      return bookType.getContent(bid, cid, {cache: urlCache}).then(function (item) {
        if (item.content) {
          $scope.item = item;
          $scope.style.height = "auto";
          temView = null;
          //记录当前阅读位置
          if (lc.existBook(book)) {
            book.chapterId = cid;
            lc.addBookshelf(book).then(function () {
            }, function () {
              tool.alert("保存记录失败！");
            });
          }
          if (item.nextId) {
            var temUrl = bookType.getYueDuHref(bid, item.nextId);
            ajax.getCache(temUrl, {cache: urlCache});
          }
        } else {
          tool.errInfo("获取内容失败！");
        }
      }, function (msg) {
        tool.errInfo(msg);
      })
    }
    getContent(bid, cid);
    $scope.toMu = function () {
      $state.go("tab.mulu", {bid: bid});
    }
    //next
    $scope.nextModel = function (flag, callback) {
      var cid = $scope.item.nextId;
      if (flag < 0) {
        cid = $scope.item.prevId;
      }
      if (bid == cid) {
        tool.alert("已是最后一章！");
        return;
      }
      getContent(bid, cid).finally(function () {
        scroll.resize().then(function () {
          callback && callback();
        });
      });
    }
    var scroll = $ionicScrollDelegate.$getByHandle('yueScroll'), temView, height = window.innerHeight, boxH;
    //var $box = $(".txt"),box_h=$box.height();
    //var $con = $(".m-content");
    //var $main = $(".main-con");
    //var $title = $main.find("h3"),t_h=$title.height();
    //var line_h = $main.find("p").css("lineHeight");
    //
    //if(line_h=="normal"){
    //  line_h = $main.find("p").css("fontSize");
    //}
    //line_h = line_h.replace(/px/,"");
    //var line = Math.floor((box_h-t_h)/line_h);
    //$main.height(line*line_h+t_h);
    //var top_h=0;
    //var getMainHeight=function () {
    //  var line = Math.floor((box_h)/line_h);
    //  $main.height(line*line_h);
    //}
    //
    //
    //$(".next").bind("click",function () {
    //  top_h+=$main.height();
    //  $con.css({top:-top_h});
    //  getMainHeight();
    //})
    //$(".up").bind("click",function () {
    //  top_h-=$main.height();
    //  $con.css({top:-top_h});
    //  getMainHeight();
    //})
    //点击翻页
    $ionicGesture.on("touch", function (event) {
      $scope.$apply(function () {
        if ($scope.isSetting) {
          $scope.isSetting = false;
          return;
        }
        if (!temView) {
          temView = 1;// scroll.getScrollView();
          boxH = Math.ceil($("#yuedu").height() / height) * height;
          $scope.style.height = boxH + "px";
        }
        var top = scroll.getScrollPosition().top;
        var t = window.innerWidth / 3, tar = event.gesture.touches[0].screenX;
        if (tar <= t) {
          if (top == 0) {
            $scope.nextModel(-1, function () {
              temView = 1;// scroll.getScrollView();
              boxH = Math.ceil($("#yuedu").height() / height) * height;
              $scope.style.height = boxH + "px";
              scroll.scrollTo(0, boxH - height);
            });
            return;
          }
          scroll.scrollBy(0, -height);
        } else if (tar > 2 * t) {
          //$ionicPopup.confirm({
          //  title: 'Consume Ice Cream',
          //  template: 'top:' + top + ",height:" + height + "boxH:" + boxH
          //})
          if (top + height + 10 >= boxH) {
            $scope.nextModel(1, function () {
              scroll.scrollTo(0, 0);
            });
            return;
          }
          scroll.scrollBy(0, height);
        }
        else {
          $scope.isSetting = true;
        }
      });
    }, angular.element(document.getElementById("yuedu")));
    $scope.changYue = function (f) {
      $scope.nextModel(f, function () {
        scroll.scrollTo(0, 0);
      });
      $scope.isSetting = false;
    }
    $scope.$on('$destroy', function () {
      $rootScope.isFull = false;
      lingbar.show();
    })
  })
  //TODO index
  .controller('indexCtrl', function ($scope, $timeout, $ionicScrollDelegate, $ionicPopup, $window, $state, $stateParams, books, $ionicHistory, catalog, $rootScope, lc, tool, ajax, $ionicSideMenuDelegate) {
    var bookType = books.getType();
    var scroll = $ionicScrollDelegate.$getByHandle('indexScroll');
    $scope.list = [];
    $scope.tabList = [];
    //滚动加载图片
    $scope.lazyImg = function () {
      tool.lazyImg(scroll);
    };
    //侧边栏
    $scope.btype = angular.copy(bookType.name);
    $scope.toggleLeftSideMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.menuList = books.getNameList();
    $scope.changeType = function (menu) {
      lc.set(lc.name.type, menu.name);
      $scope.btype = angular.copy(menu.name);
      bookType = books.getType();
      $ionicSideMenuDelegate.toggleLeft();
      getDate();
      //$state.go("tab.index", {reload: true})
    };
    function getDate() {
      tool.showLoading();
      ajax.get(bookType.host).success(function (red) {
        var temHtml = $(red);
        $scope.tabList = bookType.getIndexTabList(temHtml);
        $scope.list = bookType.getIndexList(temHtml);
      }).finally(function () {
        tool.hideLoading();
      });
    }

    var timer;
    $scope.$watch("tabList", function () {
      timer = $timeout(function () {
        tool.lazyImg(scroll);
      }, 100);
    })
    $scope.$on("$destroy", function (event) {
        $timeout.cancel(timer);
      }
    );
    getDate();
    $scope.menu = {name: "首页", link: ""};
    $scope.toMenu = function (menu) {
      $scope.menu = menu;
      getDate(menu.link);
    }
    $scope.nextPage = function (src) {
      getDate($scope.menu.link + "/" + src);
    }
    $scope.toBook = function (bookId) {
      $state.go("tab.detail", {bookId: bookId});
    }
  })
  //TODO detail
  .controller('detailCtrl', function ($scope, $state, $stateParams, $timeout, ajax, lc, books, tool,qq, $ionicScrollDelegate) {
    var bookType = books.getType();
    var bookId = $stateParams.bookId;
    var scroll = $ionicScrollDelegate.$getByHandle('detailScroll');
    $scope.book = {};
    $scope.isComplete = false;
    function getData(isRefresh) {
      return bookType.getDetail(bookId, isRefresh).then(function (book) {
        $scope.book = book;
        $scope.isAddBookshelf = lc.existBook(book);
      }, function (msg) {
        tool.errInfo(msg);
      }).finally(function () {
        $scope.isComplete = true;
      });
    }

    getData();
    $scope.$watch("book", function () {
      timer = $timeout(function () {
        tool.lazyImg(scroll);
      }, 200);
    })
    $scope.toDu = function (cid) {
      $state.go("tab.yuedu", {bid: bookId, cid: cid});
    }
    $scope.yuedu = function (flag) {
      if (flag) {
        $state.go("tab.yuedu", {bid: bookId, cid: $scope.isAddBookshelf.chapterId});
      } else {
        $state.go("tab.yuedu", {bid: bookId, cid: $scope.book.oneCid});
      }
    }
    $scope.mulu = function () {
      $state.go("tab.mulu", {bid: bookId});
    }
    $scope.addBookshelf = function () {
      lc.addBookshelf({
        typeId: bookType.id,
        bookId: bookId,
        chapterId: $scope.book.oneCid,
        name: $scope.book.title,
        author: $scope.book.author
      }).then(function () {
        $scope.isAddBookshelf = true;
        qq.saveBook();
        tool.alert("添加成功！");
      }, function () {
        tool.alert("添加失败！");
      });
    }
    $scope.doRefresh = function () {
      getData(true).finally(function () {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
  })
  //TODO 目录
  .controller('muluCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup, $ionicHistory, lc, books, ajax, tool, catalog, $ionicScrollDelegate) {
    var bookType = books.getType();
    var bookId = $stateParams.bid;
    var isExistBook = lc.existBook({typeId: bookType.id, bookId: bookId});
    var scroll = $ionicScrollDelegate.$getByHandle('muluScroll');
    $scope.list = [];
    $scope.pageIndex = 1;
    var activeIdx = 0;

    function getData(pindex, isRefresh) {
      return bookType.getMu(bookId, pindex, isRefresh).then(function (res) {
        var list = res.list;
        if (isExistBook) {
          if (list.length) {
            //activeIdx = Number(isExistBook.chapterId);
            //scroll.scrollTo(0, 44 * activeIdx);
            //list[activeIdx] && (list[activeIdx].active = 1);
          }
        }
        $scope.list = list;
        $scope.pageInfo = res.pageInfo;
        scroll.resize();
      }, function (msg) {
        tool.errInfo(msg);
      });
    }

    getData(1);
    $scope.isAsc = true;
    $scope.desc = function () {
      $scope.isAsc = !$scope.isAsc;
      $scope.list = $scope.list.reverse();
      if ($scope.isAsc) {
        scroll.scrollTo(0, 44 * activeIdx);
      } else {
        scroll.scrollTo(0, 44 * ($scope.list.length - activeIdx));
      }
    }
    $scope.goTop = function () {
      scroll.scrollTop(0);
    }
    $scope.goPage = function (pindex, mindex) {
      if (mindex) {
        var num = mindex.toString().replace(/\(/, "").replace(/\)/, "");
        pindex = pindex + Number(num);
      }
      getData(pindex, true);
    }
    $scope.doRefresh = function () {
      getData(1, true).finally(function () {
        $scope.isAsc = true;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    $scope.yuedu = function (item) {
      $state.go("tab.yuedu", {bid: bookId, cid: item.cid});
    }
    $scope.goDetail = function () {
      $state.go("tab.detail", {bookId: bookId});
    }
    $scope.$on("$destroy", function (event) {
        // $timeout.cancel(timer);
      }
    );
  })

  //TODO sort
  .controller('sortCtrl', function ($scope, $state, lc, books, $ionicPlatform, tool, ajax) {
    var bookType = books.getType();
    bookType.getSortList().then(function (list) {
      $scope.list = list;
    }, function (msg) {
      tool.errInfo(msg);
    });
    $scope.pname = "";
    $scope.toSearch = function (id) {
      //   $state.go("tab.search", {p: $scope.$$childHead.pname});
      $state.go("tab.detail", {bookId: id});
    };
    $scope.toSortBook = function (sortId) {
      $state.go("tab.sortBook", {sortId: sortId});
    }
    //$scope.isEdit = false;
    $scope.$on("$destroy", function (event) {
    });
  })
  .controller('sortBookCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup, $ionicHistory, lc, books, ajax, tool, catalog, $ionicScrollDelegate) {
    var bookType = books.getType();
    var sortId = $stateParams.sortId;
    var pindex = 1, nextPageIndex = 0;
    $scope.isScroll = true;
    $scope.list = [];
    function getDate(sortId, pindex) {
      bookType.getSortBookList(sortId, pindex).then(function (res) {
        Array.prototype.push.apply($scope.list, res.list)
        if (res.next) {
          nextPageIndex = ++pindex;
          $scope.isScroll = true;
        } else {
          nextPageIndex = 0;
          $scope.isScroll = false;
        }
      }, function (msg) {
        tool.errInfo(msg);
        $scope.isScroll = false;
      }).finally(function () {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    }

    getDate(sortId, pindex);
    $scope.next = function () {
      if (nextPageIndex) {
        pindex = nextPageIndex;
        getDate(sortId, pindex);
      }
    }
    $scope.toSort = function () {
      $state.go("tab.sort");
    }
    $scope.toBook = function (bookId) {
      $state.go("tab.detail", {bookId: bookId});
    }
  })
  //TODO : books list
  .controller('booksCtrl', function ($scope, $state, lc, books,qq, $ionicPlatform) {
    ///////
    var bookType = books.getType();
    $scope.showType = lc.get(lc.name.showType) || "grid";//grid list
    var booksList = lc.getBookshelf();
    angular.forEach(booksList, function (item) {
      item["isSelect"] = false;
      item["typeName"] = books.getNameByTypeId(item.typeId).name;
    });
    $scope.list = booksList;
    $scope.goSetting = function () {
      $state.go("tab.setting");
    };
    $scope.toIndex = function () {
      $state.go("tab.index");
    }
    $scope.isEdit = false;
    $scope.edit = function () {
      $scope.isEdit = !$scope.isEdit;
    }
    $scope.del = function () {
      var temList = [];
      var newList = [];
      angular.forEach($scope.list, function (item) {
        if (!item.isSelect) {
          var tem = [item.typeId, item.bookId, item.chapterId, item.name, item.author];
          temList.push(tem.join("|"));
          delete  item["isSelect"];
          newList.push(item);
        }
      });
      lc.set(lc.name.bookshelf, temList.join(","));
      $scope.isEdit = false;
      $scope.list = newList;
      qq.saveBook();
    }
    $scope.yuedu = function (book) {
      $state.go("tab.yuedu", {bid: book.bookId, cid: book.chapterId, typeId: book.typeId});
    }
    var backBtn = $ionicPlatform.registerBackButtonAction(function (e) {
      if ($scope.isEdit) {
        $scope.$apply(function () {
          $scope.isEdit = false;
        })
      } else {
        $state.go("tab.index");
      }
    }, 601);
    $scope.$on("$destroy", function (event) {
      backBtn();
    });
  })
  //TODO sraech
  .controller('searchCtrl', function ($scope, $stateParams, $state, $ionicLoading, $ionicPopup, $ionicHistory, lc, books, ajax, tool, catalog, $ionicScrollDelegate) {
    var bookType = books.getType();
    $scope.param = $stateParams.p;
    function getDate(pname) {
      bookType.getSearchList(pname).then(function (list) {
        $scope.list = list;
      }, function (msg) {
        tool.errInfo(msg);
      });
    }

    getDate($stateParams.p);
  })
  //TODO setting
  .controller('settingCtrl', function ($scope, $state, $rootScope, qq) {
    $scope.settings = {
      enableFriends: true
    };
    $scope.isLogin = !qq.isExpires();
    $scope.info = qq.getUserInfo();
    $scope.myInfo = function () {
      qq.login(function (res) {
        $scope.isLogin = 1;
        $scope.info = qq.getUserInfo();
      });
    }
    $scope.logout = function () {
      qq.logout(function () {
        //$scope.apply(function () {
        $scope.isLogin = 0;
        //  })
      });
    }
    $scope.back = function () {
      $state.go("tab.books");
    }
    //同步书架
    $scope.setBooks = function () {
      qq.synchroBook();
    }
    //$scope.downBooks=function () {
    //  qq.downBook();
    //}
    $scope.hasSkin = false;
    $scope.changeSkin = function (hasSkin) {
      $rootScope.skin = hasSkin ? "ye" : "";
    }
  })
  //TODO local
  .controller('localCtrl', function ($scope, lc, ajax, $cacheFactory, $state, $ionicPlatform) {
    var list = [];
    angular.forEach(localStorage, function (item, key) {
      list.push({key: key, val: item, isSelect: false});
    })
    $scope.isEdit = false;
    $scope.list = list;
    $scope.update = function () {
      var list = angular.copy($scope.list);
      angular.forEach(list, function (item, key) {
        if (item.isSelect) {
          lc.set(item.key, item.val);
        }
      })
      $scope.isEdit = false;
    }
    $scope.edit = function () {
      $scope.isEdit = !$scope.isEdit;
    }
    $scope.clear = function () {
      var list = angular.copy($scope.list);
      var temList = [];
      angular.forEach(list, function (item, key) {
        if (!item.isSelect) {
          temList.push(item);
        }
      })
      $scope.list = temList;
      $scope.isEdit = false;
    }
    var backBtn = $ionicPlatform.registerBackButtonAction(function (e) {
      if ($scope.isEdit) {
        $scope.$apply(function () {
          $scope.isEdit = false;
        })
      } else {
        $state.go("tab.setting");
      }
    }, 600);
    $scope.back = function () {
      $state.go("tab.setting");
    }
    $scope.$on("$destroy", function (event) {
      backBtn();
    });
  })
  //TODO error
  .controller('errorCtrl', function ($scope, lc, ajax, $cacheFactory, $state,tool, $ionicPopup,$ionicPlatform) {
    $scope.list = JSON.parse(localStorage["error"]);
    $scope.clear = function () {
      localStorage["error"] = JSON.stringify([]);
      $scope.list = [];
    }
    $scope.back = function () {
      $state.go("tab.setting");
    }
    $scope.showDetail=function (msg) {
      $ionicPopup.alert({
        template: msg
      });
    }
  })
  //TODO ling
  .controller('lingCtrl', function ($scope, lc, ajax, $cacheFactory, $state, $http) {
    var lingData = {
      "key": "82bfc2aebba5403c98392d768110ffd3",
      "info": "讲个笑话",
      //"loc":"北京市中关村",
      "userid": "123456"
    }
    var $ling = $("#js_ling");
    $http.post("http://www.tuling123.com/openapi/api", lingData).success(function (res) {
    })
    $scope.clear = function () {
    }
    $scope.back = function () {
    }
  })

