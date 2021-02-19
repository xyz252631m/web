define("vueTool", function () {
    function op() {
    }

    op.prototype = {
        isSaveMu: function () {
            if (this.name == "kan") {
                return false;
            }
            return true;
        },
        getMuHref: function (bid) {
            return this.host + "/wapbook-" + bid + "/";
        },
        getSortBookHref: function (sortId, pageIndex) {
            return this.host + "/sort-" + sortId + "-" + pageIndex + "/";
        },
        getYueDuHref: function (bookId, cid) {
            return this.host + "/wapbook-" + bookId + "-" + cid + "/";
        },
        getId: function (url) {
            if (!url) {
                return "";
            }
            url = url.replace(/^\//, "").replace(/\/$/, "");
            var tem = url.split('-');
            return tem[1];
        },
        getSortId: function (url) {
            if (!url) {
                return "";
            }
            url = url.replace(/^\//, "").replace(/\/$/, "");
            var tem = url.split('-');
            return tem[1] || 0;
        },
        getAuthorId: function (url) {
            if (!url) {
                return "";
            }
            url = url.replace(/^\//, "").replace(/\/$/, "");
            var tem = url.split('/');
            return tem[1];
        },
        getChapterId: function (url) {
            if (!url) {
                return "";
            }
            url = url.replace(/^\//, "").replace(/\/$/, "").replace(/.html/g, "");
            var tem = url.split('-');
            if (tem.length == 1) {
                tem = url.split("/");
            }
            return tem[tem.length - 1];
        },
        getDetailUrl: function (bookId) {
            return this.host + "/info-" + bookId + "/";
        },
        getSearchData: function (pname) {
            return {"searchkey": pname};
        },
        getDetail: function (bookId, isRefresh) {
            var self = this;
            var url = self.getDetailUrl(bookId);
            var deferred = $q.defer();
            ajax.get(url).success(function (red) {
                var item = {};
                var temHtml = $(red);
                var yue = temHtml.finds(".ablum_read");
                var yue_txt = temHtml.finds(".block_txt2");
                item["oneCid"] = self.getChapterId(yue.finds("a").eq(0).attr("href"));
                item["src"] = temHtml.finds(".block_img2").finds("img").attr("data-src") || temHtml.finds(".block_img2").finds("img").attr("src");
                item["title"] = yue_txt.finds("h2").text();
                item["author"] = yue_txt.finds("p").eq(2).finds("a").text();
                item["authorId"] = self.getAuthorId(yue_txt.finds("p").eq(2).finds("a").attr("href"));
                item["sort"] = yue_txt.finds("p").eq(3).finds("a").text();
                item["sortId"] = self.getSortId(yue_txt.finds("p").eq(3).finds("a").attr("href"));
                item["state"] = yue_txt.finds("p").eq(4).text();
                item["time"] = yue_txt.finds("p").eq(5).text();
                item["newC"] = yue_txt.finds("p").eq(6).finds("a").text();
                item["newCid"] = self.getChapterId(yue_txt.finds("p").eq(6).finds("a").attr("href"));
                item["info"] = temHtml.finds(".intro_info").text();
                //other
                item["typeId"] = self.id;
                item["bookId"] = bookId;
                item["list"] = [];
                var $ul = temHtml.finds(".chapter");
                $.each($ul.finds("li"), function (a, b) {
                    var $li = $(b), tem = {};
                    tem["cid"] = self.getChapterId($li.finds("a").attr("href"));
                    tem["title"] = $li.finds("a").text();
                    item.list.push(tem);
                });
                deferred.resolve(item);
                //book["src"] = temHtml.find(".read_yd a").attr("href");
            }).error(function (err) {
                deferred.reject("获取信息失败！");
            });
            return deferred.promise;
        },
        getContent: function (bookId, cid, option) {
            var self = this;
            var url = self.getYueDuHref(bookId, cid)
            var deferred = $q.defer();
            tool.showLoading();
            ajax.get(url, option).success(function (red) {
                var item = {};
                var temHtml = $(red);
                item["title"] = temHtml.finds("#nr_title").text();
                item["content"] = temHtml.finds("#nr1").html();
                item["prevId"] = self.getChapterId(temHtml.finds(".prev").eq(1).finds("a").attr("href"));
                item["nextId"] = self.getChapterId(temHtml.finds(".next").eq(1).finds("a").attr("href"));
                deferred.resolve(item);
            }).error(function (err) {
                deferred.reject("获取信息失败！");
            }).finally(function () {
                tool.hideLoading();
            });
            return deferred.promise;
        },
        getMu: function (bookId, pindex, flag) {
            var self = this;
            var url = self.getMuHref(bookId, pindex);
            var isExistBook = lc.existBook({typeId: this.id, bookId: bookId});
            var deferred = $q.defer();
            if (flag) {
                getData(url);
                return deferred.promise;
            }
            if (isExistBook && self.isSaveMu()) {
                catalog.get(self.name, bookId).then(function (success) {
                    var temList = JSON.parse(success);
                    deferred.resolve({next: null, list: temList});
                }, function () {
                    getData(url);
                })
            } else {
                getData(url);
            }

            function getData(src) {
                !flag && tool.showLoading();
                ajax.get(src).success(function (red) {
                    var temHtml = $(red);
                    var temList = temHtml.finds(".chapter").find("a");
                    if (!temList.length) {
                        //var errMsg = temHtml.find(".blocktitle").text();
                        deferred.reject("发生错误，请返回！");
                        return;
                    }
                    var item, list = [], temObj;
                    angular.forEach(temList, function (tem, idx) {
                        item = $(tem);
                        temObj = {cid: self.getChapterId(item.attr("href")), text: item.text(), active: 0};
                        list.push(temObj);
                    });
                    var p_obj = self.isHasNextMu(temHtml);
                    catalog.save(self.name, bookId, JSON.stringify(list));
                    deferred.resolve({pageInfo: p_obj, list: list});
                }).error(function (err) {
                    //$ionicPopup.alert({
                    //  title: 'error',
                    //  template: "获取目录失败"
                    //});
                    deferred.reject("获取目录失败");
                }).finally(function () {
                    !flag && tool.hideLoading();
                });
            }

            return deferred.promise;
        },
        isHasNextMu: function (temHtml) {
            try {
                var isNext = temHtml.finds("#pageinput");
                var info = temHtml.finds(".page").last();
                var str = info.text().match(/\(.*\)/);
                var arr = str[0].replace("第", "").replace("页", "").split("/");
                var res = {
                    isNext: isNext.length,
                    currPage: arr[0],
                    sumPage: arr[1]
                }
                return res;
            } catch (e) {
                return {
                    isNext: false,
                    currPage: 0,
                    sumPage: 0
                }
            }
        },
        getSortList: function (isRefresh) {
            var self = this;
            var url = self.sortUrl;
            var isExistSort = lcSort.isExistSort(self.name);
            var deferred = $q.defer();
            if (isRefresh) {
                getData(url);
                return deferred.promise;
            }
            if (isExistSort) {
                deferred.resolve(JSON.parse(isExistSort));
            } else {
                getData(url);
            }

            function getData(src) {
                !isRefresh && tool.showLoading();
                ajax.get(src).success(function (red) {
                    var temHtml = $(red);
                    var temList = temHtml.finds(".content").find("a");
                    if (!temList.length) {
                        //var errMsg = temHtml.find(".blocktitle").text();
                        deferred.reject("获取分类失败，请返回！");
                        return;
                    }
                    var item, list = [], temObj;
                    angular.forEach(temList, function (tem, idx) {
                        item = $(tem);
                        temObj = {id: self.getSortId(item.attr("href")), text: item.text()};
                        list.push(temObj);
                    });
                    lcSort.set(self.name, list);
                    deferred.resolve(list);
                }).error(function (err) {
                    deferred.reject("获取分类失败");
                    tool.showTip(err);
                }).finally(function () {
                    !isRefresh && tool.hideLoading();
                });
            }

            return deferred.promise;
        },
        getSortBookList: function (sortId, pageIndex) {
            var self = this;
            var url = self.getSortBookHref(sortId, pageIndex);
            var deferred = $q.defer();
            ajax.get(url).success(function (red) {
                var temHtml = $(red);
                var temList = temHtml.finds(".cover").finds(".line");
                if (!temList.length) {
                    //var errMsg = temHtml.find(".blocktitle").text();
                    deferred.reject("无分类数据，请返回！");
                    return;
                }
                var item, list = [];
                angular.forEach(temList, function (tem, idx) {
                    item = $(tem);
                    var temObj = {};
                    temObj["sort"] = item.finds("a").eq(0).text();
                    temObj["sortId"] = self.getSortId(item.finds("a").eq(0).attr("href"));
                    temObj["title"] = item.finds("a").eq(1).text();
                    temObj["bookId"] = self.getId(item.finds("a").eq(1).attr("href"));
                    temObj["author"] = item.finds("a").eq(2).text();
                    temObj["authorId"] = self.getAuthorId(item.finds("a").eq(2).attr("href"));
                    list.push(temObj);
                });
                var next = temHtml.finds(".page").eq(0).text();
                deferred.resolve({list: list, next: next.match(/下页/)});
            }).error(function (err) {
                deferred.reject("获取分类数据失败");
            }).finally(function () {
            })
            return deferred.promise;
        },
        getSearchList: function (pname) {
            var self = this;
            var url = self.searchUrl;
            var deferred = $q.defer();
            tool.showLoading();
            var data = self.getSearchData(pname);
            ajax.post(url, data).success(function (red) {
                var temHtml = $(red);
                var temList = temHtml.finds(".cover").finds(".line");
                if (!temList.length) {
                    //var errMsg = temHtml.find(".blocktitle").text();
                    deferred.reject("无数据，请返回！");
                    return;
                }
                var item, list = [], temObj;
                angular.forEach(temList, function (tem, idx) {
                    item = $(tem);
                    temObj["sort"] = item.finds("a").eq(0).text();
                    temObj["sortId"] = self.getSortId(item.finds("a").eq(0).attr("href"));
                    temObj["title"] = item.finds("a").eq(1).text();
                    temObj["bookId"] = self.getId(item.finds("a").eq(1).attr("href"));
                    temObj["author"] = item.finds("a").eq(2).text();
                    temObj["authorId"] = self.getAuthorId(item.finds("a").eq(2).attr("href"));
                    list.push(temObj);
                });
                deferred.resolve(list);
            }).error(function (err) {
                deferred.reject("搜索失败");
            }).finally(function () {
                tool.hideLoading();
            })
            return deferred.promise;
        },
        getIndexTabList: function (temHtml) {
            var self = this;
            var temList = temHtml.finds(".article");
            var tabList = [];
            $.each(temList, function (idx, item) {
                var $box = $(item), list = [];
                //title
                var title = {
                    text: $box.find(".title a").eq(0).text(),
                    typeId: self.getId($box.find(".title a").eq(0).attr("href"))
                }
                //one
                var $ul = $box.finds("ul"), block = $ul.finds(".block_img"), block_txt = $ul.finds(".block_txt");
                var one = {
                    src: block.finds("img").attr("data-src") || block.finds("img").attr("data-data-src"),
                    bookId: self.getId(block.finds("a").attr("href")),
                    author: block_txt.finds("p").eq(2).finds("a").text(),
                    authorId: self.getAuthorId(block_txt.finds("p").eq(2).finds("a").attr("href")),
                    title: block_txt.finds("h2").text(),
                    info: block_txt.finds("p").eq(3).text()
                }
                //list
                $.each($ul.finds("li"), function (a, b) {
                    var $li = $(b), item = {};
                    item["sort"] = $li.finds("a").eq(0).text();
                    item["sortId"] = self.getId($li.finds("a").eq(0).attr("href"));
                    item["title"] = $li.finds("a").eq(1).text();
                    item["bookId"] = self.getId($li.finds("a").eq(1).attr("href"));
                    item["author"] = $li.finds("a").eq(2).text();
                    item["authorId"] = self.getAuthorId($li.finds("a").eq(2).attr("href"));
                    list.push(item);
                });
                tabList.push({title: title, one: one, list: list});
            })
            return tabList;
        },
        getIndexList: function (temHtml) {
            var list = [];
            //最新更新
            //var newBox = temHtml.siblings(".idx_gx");
            //var newList = newBox.find("dd");
            //var newTitle = newBox.find(".title").text();
            //$.each(newList, function (idx, dd) {
            //  var $dd = $(dd), item = {};
            //  item["href"] = $dd.find("a").eq(0).attr("href");
            //  item["title"] = $dd.find("a").eq(0).text();
            //  item["author"] = $dd.find(".zz").text();
            //  item["time"] = $dd.find(".rq").text();
            //  list.push(item);
            //})
            //  return {title: newTitle, list: list};
            return {title: "", list: list};
        }
    }

    let bookTypeList = {
        xiang: function () {
            var t = new op();
            t.id = 0;
            t.name = "xiang";
            t.text = "乡村";
            t.host = "http://m.xiangcunxiaoshuo.com";
            t.sortUrl = t.host + "/sort.html";
            t.searchUrl = t.host + "/modules/article/waps.php";
            return t;
        }(),
        kan: function () {
            var t = new op();
            t.id = 1;
            t.name = "kan";
            t.text = "看书阁";
            t.host = "http://m.kanshuge.la";
            t.sortUrl = t.host + "/sort.html";
            t.searchUrl = t.host + "/modules/article/waps.php";
            t.getId = function (url) {
                if (!url) {
                    return "";
                }
                url = url.replace(".htm", "").replace("htm", "").replace(/^\//, "").replace(/\/$/, "");
                var tem = url.split('/');
                return tem[1];
            }
            t.getChapterId = function (url) {
                if (!url) {
                    return "";
                }
                url = url.replace(".html", "").replace(/^\//, "").replace(/\/$/, "");
                var tem = url.split('/');
                return tem[tem.length - 1];
            },
                t.getDetailUrl = function (bookId) {
                    return this.host + "/info/" + bookId + ".htm";
                }
            t.getYueDuHref = function (bookId, cid) {
                return this.host + "/html/" + bookId + "/" + cid + ".html";
            }
            t.getMuHref = function (bid, pindex) {
                return this.host + "/html/" + bid + "_" + pindex + "/";
            }
            t.search = function (str) {
                ajax.post(t.searchUrl, {s: str}, {headers: {'contentType': 'application/x-www-form-urlencoded;charset=UTF-8'}}).success(function (red) {
                    console.log(red);
                })
            }
            return t;
        }(),
        xiao: function () {
            var t = new op();
            t.id = 2;
            t.name = "xiao";
            t.text = "小小书屋";
            t.host = "http://m.xiaoxiaoshuwu.com";
            t.sortUrl = t.host + "/wap/sort.php";
            t.searchUrl = t.host + "/modules/article/waps.php";
            t.getChapterId = function (url) {
                if (!url) {
                    return "";
                }
                url = url.replace(".html", "").replace(/^\//, "").replace(/\/$/, "");
                var tem = url.split('-');
                return tem[tem.length - 1];
            }
            t.getDetailUrl = function (bookId) {
                return this.host + "/info-" + bookId + "/";
            }
            t.getYueDuHref = function (bookId, cid) {
                var id = bookId.toString().match(/(\d+)(\d{3})$/);
                return this.host + "/" + id[1] + "/" + bookId + "/" + cid + ".html";
            }
            t.getMuHref = function (bid, pindex) {
                var id = bid.toString().match(/(\d+)(\d{3})$/);
                return this.host + "/" + id[1] + "/" + bid + "/index.html";
            }
            return t;
        }(),
        bxwx: function () {
            var t = new op();
            t.id = 3;
            t.name = "bxwx";
            t.text = "笔下文学";
            t.host = "http://m.bxwx.com";
            t.sortUrl = t.host + "/sort/";
            t.searchUrl = t.host + "/modules/article/waps.php";
            t.getId = function (url) {
                if (!url) {
                    return "";
                }
                url = url.replace(".htm", "").replace("htm", "").replace(/^\//, "").replace(/\/$/, "");
                var tem = url.split('/');
                return tem[1];
            }
            t.getSortId = function (url) {
                var tem = url.match(/\d+/);
                if (!tem) {
                    return "";
                }
                return tem[0];
            }
            t.getSortBookHref = function (sortId, pageIndex) {
                return this.host + "/sort/" + sortId + "_" + pageIndex + "/";
            }
            t.getDetailUrl = function (bookId) {
                return this.host + "/book/" + bookId + "/";
            }
            t.getYueDuHref = function (bookId, cid) {
                var id = bookId.toString().match(/(\d*)(\d{3})$/);
                return this.host + "/" + (id[1] || 0) + "/" + bookId + "/" + cid + ".html";
            }
            t.getMuHref = function (bid, pindex) {
                var id = bid.toString().match(/(\d*)(\d{3})$/);
                return this.host + "/" + (id[1] || 0) + "/" + bid + "_" + pindex + "/";
            }
            return t;
        }(),
        kanshu: function () {
            var t = new op();
            t.id = 4;
            t.name = "kanshu";
            t.text = "要看书网";
            t.host = "http://m.1kanshu.cc";
            t.sortUrl = t.host + "/sort.html";
            t.searchUrl = t.host + "/modules/article/waps.php";
            t.getId = function (url) {
                if (!url) {
                    return "";
                }
                url = url.replace(/^\//, "").replace(/\/$/, "");
                var tem = url.split("/");
                return tem[tem.length - 1];
            }
            t.getIndexTabList = function (temHtml) {
                var self = this;
                var temList = temHtml.finds(".article");
                var tabList = [];
                $.each(temList, function (idx, item) {
                    var $box = $(item), list = [];
                    //title
                    var title = {
                        text: $box.find(".title a").eq(0).text(),
                        typeId: self.getId($box.find(".title a").eq(0).attr("href"))
                    }
                    //one
                    var $ul = $box.finds("ul"), block = $ul.finds(".block_img"), block_txt = $ul.finds(".block_txt");
                    var one = {
                        src: block.finds("img").attr("data-src") || block.finds("img").attr("data-data-src"),
                        bookId: self.getId(block.finds("a").attr("href")),
                        author: block_txt.finds("p").eq(2).text(),
                        authorId: self.getAuthorId(block_txt.finds("p").eq(2).finds("a").attr("href")),
                        title: block_txt.finds("h2").text(),
                        info: block_txt.finds("p").eq(3).text()
                    }
                    //list
                    $.each($ul.finds("li"), function (a, b) {
                        var $li = $(b), item = {};
                        item["sort"] = "";
                        item["sortId"] = "";
                        item["title"] = $li.finds("a").eq(0).text();
                        item["bookId"] = self.getId($li.finds("a").eq(0).attr("href"));
                        item["author"] = $li.text().match(/\/\S+/)[0];
                        item["authorId"] = "";
                        list.push(item);
                    });
                    tabList.push({title: title, one: one, list: list});
                })
                return tabList;
            }
            t.getSortBookList = function (sortId, pageIndex) {
                var self = this;
                var url = self.getSortBookHref(sortId, pageIndex);
                var deferred = $q.defer();
                ajax.get(url).success(function (red) {
                    var temHtml = $(red);
                    var temList = temHtml.finds(".bookinfo");
                    if (!temList.length) {
                        //var errMsg = temHtml.find(".blocktitle").text();
                        deferred.reject("无分类数据，请返回！");
                        return;
                    }
                    var item, list = [];
                    var name = temHtml.finds(".toptab").text();
                    angular.forEach(temList, function (tem, idx) {
                        item = $(tem);
                        var temObj = {};
                        temObj["sort"] = name;
                        temObj["sortId"] = "";
                        temObj["title"] = item.finds("a").eq(0).text();
                        temObj["bookId"] = self.getId(item.finds("a").eq(0).attr("href"));
                        temObj["author"] = item.finds(".author").text();
                        temObj["authorId"] = "";
                        list.push(temObj);
                    });
                    var next = temHtml.finds(".page").eq(0).text();
                    deferred.resolve({list: list, next: next.match(/下页/)});
                }).error(function (err) {
                    deferred.reject("获取分类数据失败");
                }).finally(function () {
                })
                return deferred.promise;
            }
            t.getSortId = function (url) {
                if (!url) {
                    return "";
                }
                var tem = url.replace(/^\//, "").replace(/\/$/, "");
                return tem;
            }
            t.getSortBookHref = function (sortId, pageIndex) {
                return this.host + "/" + sortId + "/";
            }
            t.getDetailUrl = function (bookId) {
                var id = bookId.toString().match(/(\d+)(\d{3})$/);
                return this.host + "/files/article/html/" + id[1] + "/" + bookId + "/";
            }
            t.getYueDuHref = function (bookId, cid) {
                var id = bookId.toString().match(/(\d+)(\d{3})$/);
                return this.host + "/files/article/html/" + id[1] + "/" + bookId + "/" + cid + ".html";
            }
            t.getMuHref = function (bid, pindex) {
                var id = bid.toString().match(/(\d+)(\d{3})$/);
                var index = pindex < 2 ? "" : "index_" + pindex + ".html";
                return this.host + "/files/article/html/" + id[1] + "/" + bid + "/" + index;
            }
            t.isHasNextMu = function (temHtml) {
                try {
                    var opt = temHtml.finds(".middle").finds("option");
                    var len = opt.length;
                    var select = opt.filter(":selected");
                    var idx = opt.index(select);
                    var res = {
                        isNext: 1,
                        currPage: idx + 1,
                        sumPage: len
                    }
                    return res;
                } catch (e) {
                    return {
                        isNext: false,
                        currPage: 0,
                        sumPage: 0
                    }
                }
            }
            return t;
        }(),
        uu: function () {
            var t = new op();
            t.id = 5;
            t.name = "uu";
            t.text = "uu小说";
            t.host = "http://m.uuxs.net";
            t.sortUrl = t.host + "/index/type-0-1";
            t.searchUrl = t.host + "/modules/article/waps.php";
            t.getId = function (url) {
                if (!url) {
                    return "";
                }
                url = url.replace(/^\//, "").replace(/\/$/, "");
                var tem = url.split("/");
                return tem[tem.length - 1];
            }
            t.getIndexTabList = function (temHtml) {
                var self = this;
                var temList = temHtml.finds(".inner");
                var tabList = [];
                $.each(temList, function (idx, item) {
                    var $box = $(item), list = [];
                    //title
                    var title = {
                        text: $box.find(".title h3").eq(0).text(),
                        typeId: ""
                    }
                    var $ul = $box.finds("ul");
                    //list
                    $.each($ul.finds("li"), function (a, b) {
                        var $li = $(b), item = {};
                        item["sort"] = $li.text().match(/\[.*\]/)[0];
                        item["sortId"] = "";
                        item["title"] = $li.finds("a").eq(0).text();
                        item["bookId"] = self.getId($li.finds("a").eq(0).attr("href"));
                        item["author"] = $li.text().match(/\S+/g)[2];
                        item["authorId"] = "";
                        list.push(item);
                    });
                    tabList.push({title: title, one: null, list: list});
                })
                return tabList;
            }
            t.getDetailUrl = function (bookId) {
                var id = bookId.toString().match(/(\d+)?(\d{3})$/);
                return this.host + "/book/" + (id[1] || 0) + "/" + bookId + "/";
            }
            t.getDetail = function (bookId, isRefresh) {
                var self = this;
                var url = self.getDetailUrl(bookId);
                var deferred = $q.defer();
                ajax.get(url).success(function (red) {
                    var item = {};
                    var temHtml = $(red);
                    var bookInfo = temHtml.finds(".bookinfo");
                    var yue_txt = temHtml.finds(".block_txt2");
                    item["oneCid"] = "";
                    item["src"] = "img/noimg.jpg";
                    item["title"] = bookInfo.finds(".fl").eq(0).finds("h1").text();
                    item["author"] = bookInfo.finds(".fl").eq(0).finds("em").text();
                    item["authorId"] = "";
                    item["sort"] = "";
                    item["sortId"] = "";
                    item["state"] = bookInfo.finds(".stats").finds(".fr i").eq(0).text();
                    item["time"] = bookInfo.finds(".stats").finds(".fr i").eq(2).text();
                    item["newC"] = bookInfo.finds(".stats").finds(".fl").eq(0).find("a").text();
                    item["newCid"] = self.getChapterId(bookInfo.finds(".stats").finds(".fl").eq(0).find("a").attr("href"));
                    item["info"] = temHtml.finds(".intro").text();
                    //other
                    item["typeId"] = self.id;
                    item["bookId"] = bookId;
                    item["list"] = [];
                    var $ul = temHtml.finds(".chapterlist");
                    $.each($ul.finds("dd"), function (a, b) {
                        var $li = $(b), tem = {};
                        tem["cid"] = self.getChapterId($li.finds("a").attr("href"));
                        tem["title"] = $li.finds("a").text();
                        item.list.push(tem);
                    });
                    deferred.resolve(item);
                    //book["src"] = temHtml.find(".read_yd a").attr("href");
                }).error(function (err) {
                    deferred.reject("获取信息失败！");
                });
                return deferred.promise;
            }
            t.getYueDuHref = function (bookId, cid) {
                var id = bookId.toString().match(/(\d+)(\d{3})$/);
                return this.host + "/book/" + id[1] + "/" + bookId + "/" + cid + ".html";
            }
            t.getChapterId = function (url) {
                if (!url || url == "index.html") {
                    return "";
                }
                url = url.replace(/^\//, "").replace(/\/$/, "").replace(/.html/g, "");
                var tem = url.split('-');
                if (tem.length == 1) {
                    tem = url.split("/");
                }
                return tem[tem.length - 1];
            }
            t.getContent = function (bookId, cid, option) {
                var self = this;
                var url = self.getYueDuHref(bookId, cid)
                var deferred = $q.defer();
                tool.showLoading();
                ajax.get(url, option).success(function (red) {
                    var item = {};
                    var temHtml = $(red);
                    item["title"] = temHtml.finds("#BookTitle").text();
                    item["content"] = temHtml.finds("#BookText").html();
                    item["prevId"] = self.getChapterId(temHtml.finds("#book-prev").attr("href"));
                    item["nextId"] = self.getChapterId(temHtml.finds("#book-next").attr("href"));
                    deferred.resolve(item);
                }).error(function (err) {
                    deferred.reject("获取信息失败！");
                }).finally(function () {
                    tool.hideLoading();
                });
                return deferred.promise;
            }

            t.getMuHref = function (bid, pindex) {
                var id = bid.toString().match(/(\d+)(\d{3})$/);
                return this.host + "/book/" + id[1] + "/" + bid + "/";
            }
            t.getMu = function (bookId, pindex, flag) {
                var self = this;
                var url = self.getMuHref(bookId, pindex);
                var isExistBook = lc.existBook({typeId: this.id, bookId: bookId});
                var deferred = $q.defer();
                if (flag) {
                    getData(url);
                    return deferred.promise;
                }
                if (isExistBook && self.isSaveMu()) {
                    catalog.get(self.name, bookId).then(function (success) {
                        var temList = JSON.parse(success);
                        deferred.resolve({next: null, list: temList});
                    }, function () {
                        getData(url);
                    })
                } else {
                    getData(url);
                }

                function getData(src) {
                    !flag && tool.showLoading();
                    ajax.get(src).success(function (red) {
                        var temHtml = $(red);
                        var temList = temHtml.finds(".chapterlist").find("a");
                        if (!temList.length) {
                            //var errMsg = temHtml.find(".blocktitle").text();
                            deferred.reject("发生错误，请返回！");
                            return;
                        }
                        var item, list = [], temObj;
                        angular.forEach(temList, function (tem, idx) {
                            item = $(tem);
                            temObj = {cid: self.getChapterId(item.attr("href")), text: item.text(), active: 0};
                            list.push(temObj);
                        });
                        var p_obj = self.isHasNextMu(temHtml);
                        catalog.save(self.name, bookId, JSON.stringify(list));
                        deferred.resolve({pageInfo: p_obj, list: list});
                    }).error(function (err) {
                        //$ionicPopup.alert({
                        //  title: 'error',
                        //  template: "获取目录失败"
                        //});
                        deferred.reject("获取目录失败");
                    }).finally(function () {
                        !flag && tool.hideLoading();
                    });
                }

                return deferred.promise;
            }

            t.getSortList = function (isRefresh) {
                var self = this;
                var url = self.sortUrl;
                var isExistSort = lcSort.isExistSort(self.name);
                var deferred = $q.defer();
                if (isRefresh) {
                    getData(url);
                    return deferred.promise;
                }
                if (isExistSort) {
                    deferred.resolve(JSON.parse(isExistSort));
                } else {
                    getData(url);
                }

                function getData(src) {
                    !isRefresh && tool.showLoading();
                    ajax.get(src).success(function (red) {
                        var temHtml = $(red);
                        var temList = temHtml.finds(".item-type").find("a");
                        if (!temList.length) {
                            //var errMsg = temHtml.find(".blocktitle").text();
                            deferred.reject("获取分类失败，请返回！");
                            return;
                        }
                        var item, list = [], temObj;
                        angular.forEach(temList, function (tem, idx) {
                            item = $(tem);
                            temObj = {id: self.getSortId(item.attr("href")), text: item.text()};
                            list.push(temObj);
                        });
                        lcSort.set(self.name, list);
                        deferred.resolve(list);
                    }).error(function (err) {
                        deferred.reject("获取分类失败");
                        tool.showTip(err);
                    }).finally(function () {
                        !isRefresh && tool.hideLoading();
                    });
                }

                return deferred.promise;
            }
            t.getSortBookList = function (sortId, pageIndex) {
                var self = this;
                var url = self.getSortBookHref(sortId, pageIndex);
                var deferred = $q.defer();
                ajax.get(url).success(function (red) {
                    var temHtml = $(red);
                    var temList = temHtml.finds(".item-list li");
                    if (!temList.length) {
                        //var errMsg = temHtml.find(".blocktitle").text();
                        deferred.reject("无分类数据，请返回！");
                        return;
                    }
                    var item, list = [];
                    var name = temHtml.finds(".toptab").text();
                    angular.forEach(temList, function (tem, idx) {
                        item = $(tem);
                        var temObj = {};
                        temObj["sort"] = item.text().match(/\[(.*)\]/)[1];
                        temObj["sortId"] = "";
                        temObj["title"] = item.finds("a").eq(0).text();
                        temObj["bookId"] = self.getId(item.finds("a").eq(0).attr("href"));
                        temObj["author"] = item.text().match(/\S+/g)[2];
                        temObj["authorId"] = "";
                        list.push(temObj);
                    });
                    var next = temHtml.finds(".pages").eq(0).text();
                    deferred.resolve({list: list, next: next.match(/下页/)});
                }).error(function (err) {
                    deferred.reject("获取分类数据失败");
                }).finally(function () {
                })
                return deferred.promise;
            }

            t.getSortBookHref = function (sortId, pageIndex) {
                return this.host + "/index/type-" + sortId + "-" + pageIndex;
            }
            return t;
        }()


    };

    let type = {

        text: "text",
        attr: "attr",

    }
    let books = {
        getType: function () {
            var typeName = lc.get(lc.name.type);
            if (typeName && bookTypeList[typeName]) {
                return bookTypeList[typeName]
            } else {
                return bookTypeList.xiang;
            }
        },
        getNameList: function () {
            var key, nameList = [];
            if (_nameList) {
                return _nameList;
            } else {
                for (key in bookTypeList) {
                    if (bookTypeList.hasOwnProperty(key)) {
                        nameList.push({name: bookTypeList[key].name, text: bookTypeList[key].text});
                    }
                }
                _nameList = nameList;
            }
            return _nameList;
        },
        getNameByTypeId: function (typeId) {
            var key;
            for (key in bookTypeList) {
                if (bookTypeList.hasOwnProperty(key)) {
                    if (bookTypeList[key].id == typeId) {
                        return bookTypeList[key];
                    }
                }
            }
            return null;
        },

        pathRule(str, ruleList) {
            if (!str || !ruleList) {
                return "";
            }
            ruleList.forEach(d => {
                switch (d.key) {
                    case "match":
                        let tem = str.match(d.val)
                        if (tem) {
                            str = tem[d.idx || 0];
                        }
                        break;
                    case "replace":
                        str = str.replace(d.val, d.val2 || "");
                        break;
                    case "split":
                        str = str.split(d.val);
                        break;
                    case "join":
                        str = str.join(d.val);
                        break;
                }

            });
            return str;
        },
        getIndexTabList($doc) {
            let pathObj = JSON.parse(lc.get(lc.name.pathConfig) || "[]")[0];
            if (!pathObj) {
                return;
            }
            let pathRule = this.pathRule;
            let protocol = pathObj.protocol;
            let host = protocol + "://" + pathObj.host;

            let title = "";
            let tabList = [];

            let boxList = $doc.finds(pathObj.path);

            try {
                $.each(boxList, function (idx) {
                    if (pathObj.not && pathObj.not.split(",").indexOf(idx.toString()) >= 0) {
                        return;
                    }
                    let tabItem = {
                        //大标题
                        bigTitle: "",
                        //first book info
                        imgSrc: "",
                        bookId: "",
                        author: "",
                        authorId: "",
                        title: "",
                        info: ""
                    };
                    let $boxItem = $(this);
                    pathObj.value.forEach(d => {
                        let $el = $boxItem.find(d.path).eq(d.eq || 0);
                        if (d.type === "text") {
                            tabItem[d.name] = $el.text();
                        } else {
                            let str = "";
                            if (d.type === "attr") {
                                str = $el.attr(d.attr);
                            } else if (d.type === "bookImg") {
                                str = $el.attr(d.attr);
                            }
                            if (d.rule) {
                                str = pathRule(str, d.rule)
                            }
                            console.log("str", str)
                            tabItem[d.name] = str;
                        }
                    });


                    let list = [];
                    pathObj.children.forEach(d => {


                    });

                    tabList.push({tabItem, list})
                })

                console.log("tablist", tabList)

                return tabList;
            } catch (e) {
                console.error(e, e.toString());
            }
        }
    };

    let lc = {
        name: {
            type: "type",
            bookshelf: "bookshelf",
            startNum: "startNum",
            showType: "showType",
            sort: "sort",
            // 显示通知
            showTip: "showTip",
            pathConfig: "pathConfig",
        },
        get: function (name) {
            return localStorage[name] || "";
        },
        set: function (name, value) {
            localStorage[name] = value;
        },
        //获取书架对象
        getBookshelf: function () {
            var str = this.get("bookshelf"), list = [];
            if (str) {
                var listStr = str.split(',');
                angular.forEach(listStr, function (item) {
                    var tem = item.split('|');
                    list.push({typeId: tem[0], bookId: tem[1], chapterId: tem[2], name: tem[3], author: tem[4]});
                })
            }
            return list;
        },
        existBook: function (item) {
            var list = this.getBookshelf();
            var f = null;
            angular.forEach(list, function (b) {
                if (item.typeId == b.typeId && item.bookId == b.bookId) {
                    f = b;
                }
            })
            return f;
        },
        //添加书架
        addBookshelf: function (item, notReplace) {
            var deferred = $q.defer();
            try {
                var list = this.getBookshelf();
                if (this.existBook(item)) {
                    angular.forEach(list, function (b) {
                        if (item.typeId == b.typeId && item.bookId == b.bookId) {
                            !notReplace && (b.chapterId = item.chapterId);
                            item.name && (b.name = item.name);
                            item.author && (b.author = item.author);
                        }
                    })
                } else {
                    list.push(item);
                }
                var res = [], tem;
                angular.forEach(list, function (b) {
                    tem = [b.typeId, b.bookId, b.chapterId, b.name, b.author];
                    res.push(tem.join("|"));
                })
                this.set("bookshelf", res.join(","));
                deferred.resolve(list);
            } catch (e) {
                deferred.reject(e);
            }
            return deferred.promise;
        },
        //同步书架
        addListBookshelf: function (list) {
            var self = this;
            var b_list = this.getBookshelf();
            $.each(list, function () {
                if (self.existBook(this)) {

                } else {
                    b_list.push(this);
                }
            })
            var res = [], tem;
            angular.forEach(b_list, function (b) {
                tem = [b.typeId, b.bookId, b.chapterId, b.name, b.author];
                res.push(tem.join("|"));
            })
            this.set("bookshelf", res.join(","));
        },
        //删除书架
        removeBookshelf: function (item) {
            var deferred = $q.defer();
            try {
                var str = this.get("bookshelf");
                var itemStr = [item.typeId, item.bookId, item.chapterId].join("|");
                str.replace(itemStr, "").replace(/,{2}]/, ",");
                this.set("bookshelf", str);
                deferred.resolve(this.getBookshelf());
            } catch (e) {
                deferred.reject(e);
            }
            return deferred.promise;
        }
    };

    let typeMap = {
        init: [
            {val: 'function', txt: "函数(fn)"},
            {val: 'let', txt: "变量(let)"},
            {val: 'const', txt: "常量(const)"},
        ],
    }

    return {
        bookTypeList,
        books,
        lc,
        typeMap
    }
});