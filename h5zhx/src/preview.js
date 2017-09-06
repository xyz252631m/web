;(function (window) {
	var urlSrc = "beta.ule.com";
	var host = location.host;
	if (host.indexOf("ule.com") >= 0 && host.indexOf("beta.ule.com") < 0) {
		urlSrc = "ule.com";
	}
	window.pre = {
		urlSrc: urlSrc,
		stroeId: $("#storeId").val() || "",
		window: {
			w: $(window).width(),
			h: $(window).height()
		},
		resetWinH: function () {
			this.window.h = $(window).height();
		},
		url: {
			searchGoods: "//m." + urlSrc + "/microshop/api/finding/v1/listings",
		},
		getSearchName: function (name) {
			var str = location.search.replace(/\?/, "");
			var arr = str.split("&");
			var obj = {};
			$.each(arr, function () {
				var tem = this.split("=");
				obj[tem[0]] = decodeURIComponent(tem[1]);
			})
			return obj[name] || "";
		},
		jsonp: function (url, data, callback, callbackName) {
			$.ajax({
				url: url,
				dataType: "jsonp",
				data: data,
				jsonp: callbackName || "callback",
				success: function (res) {
					callback && callback(res);
				}
			});
		},
		delayImg: function () {
			var timeId = null, l = 100;
			pre.delayImg = function () {
				//var winH = $(window).height(), winW = $(window).width();
				var winH = pre.window.h, winW = pre.window.w;
				var scrH = $(window).scrollTop(), scrL = $(window).scrollLeft();
				var inH = function (num) {
					return (num - l >= scrH && num < (winH + scrH + l)) ? true : false;
				};
				$("img[data-src]").each(function () {
					var o = $(this), pos = o.offset();
					var t = pos.top;
					var h = 125;// o.height();
					if (inH(t) || inH(t + h)) {
						o.attr('src', o.attr('data-src'));
						o.removeAttr('data-src');
					}
				});
			}
			pre.delayImg();
			$(window).bind("scroll resize", function () {
				clearTimeout(timeId);
				timeId = setTimeout(function () {
					pre.delayImg();
				}, 100);
			});
		},
		//商品搜索
		goodsSearch: {
			getData: function (data, success, error, callbackName) {
				var d = {
					pageSize: 20,
					pageIndex: 1,
					microshoppId: $("#storeId").val() || 11,
					listingName: $("#searchText").val()
				}
				$.extend(d, data);
				$.ajax({
					url: pre.url.searchGoods,
					dataType: "jsonp",
					data: d,
					jsonp: callbackName || "callback",
					success: function (res) {
						//success && success(res);
						if (res.status == 0) {
							var list = res.result.listingList || [];
							if (list && list.length) {
								var html = pre.goodsSearch.resetHtml(list);
								$(".search-result ul").append(html);
								$(".search-null").hide();
							} else {
								$(".search-result ul").html("");
								$(".search-null").show();
							}
							if (res.result) {
								var val = [res.result.pageIndex, res.result.totalPageNum].join(",");
								$(".pages-loading").attr("data-val", val);
								//if(res.result.totalPageNum>1){
								//	 //$(".pages-search").show();
								//}
								if (res.result.pageIndex >= res.result.totalPageNum) {
									$(".search-result .pages-loading").hide();
								} else {
									$(".search-result .pages-loading").show();
								}
							}
							pre.resetWinH();
							pre.delayImg();
						} else {
							$(".search-result ul").html("");
							$(".search-null").show();
						}
					}
				});
			},
			resetHtml: function (list) {
				var h = [];
				$.each(list, function (idx, el) {
					h.push('<li>');
					h.push('<div class = "p-img">');
					h.push('<a href = "' + el.listingUrl + '">');
					h.push('<img src = "//i2.beta.ulecdn.com/mobile/decorate/161226/images/1px.gif" data-src="' + el.imgUrl_sl + '">');
					h.push('</a>');
					h.push('</div>');
					h.push('<div class = "des-info">');
					h.push('<p class = "goods-name"><a href = "' + el.listingUrl + '">' + el.listingName + '</a></p>');
					h.push('<p class = "goods-price"><em>¥' + el.minPrice + '</em></p>');
					h.push('<a class = "btn-buy"></a>');
					h.push('</div>');
					h.push('</li>');
				});
				return h.join(" ");
			},
			getDataByPage: function ($node, isNext) {
				if (!$node.hasClass('dis')) {
					var val = $node.attr("data-val");
					if (val) {
						var obj = val.split(",").map(function (a) {
							return parseInt(a);
						});
						if (isNext) {
							//判断有下一页
							if (obj[0] < obj[1]) {
								pre.goodsSearch.getData({pageIndex: obj[0] + 1});
							}
						} else {
							//判断是否有上一页
							if (obj[0] > 0) {
								pre.goodsSearch.getData({pageIndex: obj[0] - 1});
							}
						}
					}
				}
			},
			bindEvent: function () {
				$(".search-result")[0].addEventListener('touchend', function () {
					var scrH = $(window).scrollTop();
					var $lod = $(".pages-loading");
					if ($lod.css("display") == "block") {
						if ($lod.offset().top - pre.window.h <= scrH) {
							pre.goodsSearch.getDataByPage($lod, 1);
						}
					}
				});
			}
		},
		//图片广告
		imgAd: {
			init: function ($node) {
				var $box = $node.find(".adi-list");
				var $list = $box.find("a");
				this.checkImg($list, function (h_list) {
					var h = Math.max.apply([], h_list);
					$box.css({
						height: h
					})
				});
				if ($list.length < 2) {
					return;
				}
				var $icon = $node.find(".adi-list-icon");
				this.addIconLi($icon, $list);
				var w = pre.window.w;
				$box.append($list.clone());
				$list = $(".type-carousel .adi-list a");
				$(".type-carousel .adi-list").css({
					"min-height": "50px",
					position: "relative",
					"transition-duration": "0s",
					"transform": "translateX(" + -(w * ($list.length / 2)) + "px)"
				})
				$.each($list, function (idx, el) {
					$(el).css({
						height: "100%",
						width: "100%",
						left: idx * w
					})
				})
				this.bindEvent($box, $list, $icon);
			},
			addIconLi: function ($icon, $list) {
				var h = [];
				$.each($list, function (idx) {
					if (idx == 0) {
						h.push("<li class='active'>.</li>")
					} else {
						h.push("<li>.</li>");
					}
				})
				$icon.html(h.join(" "));
			},
			checkImg: function ($list, callback) {
				var h_list = [];
				$.each($list, function (idx, el) {
					var img = $list.eq(idx).find("img")[0];
					if (img.src) {
						var check = function () {
							// 只要任何一方大于0 表示服务器已经返回宽高
							if (img.width > 0 || img.height > 0) {
								h_list.push(img.height);
								clearInterval(set);
								if (h_list.length == $list.length) {
									callback && callback(h_list);
								}
							}
						};
						var set = setInterval(check, 40);
					}
				})
			},
			bindEvent: function ($box, $list, $icon) {
				var w = pre.window.w, len = $list.length;
				var isdrag, x, x1, left_val = -w * (len / 2), iconIdx = 0, timer;
				$list.bind("touchstart", function (e) {
					isdrag = true;
					e.preventDefault();
					x = e.touches[0].pageX;
					clearInterval(timer);
				});
				$list.bind("touchmove", function (e) {
					if (isdrag) {
						e.preventDefault();
						var t = left_val + e.touches[0].pageX - x;
						$box.css({
							"transition-duration": "0s",
							"transform": "translateX(" + t + "px)"
						});
						x1 = e.touches[0].pageX;
					}
				})
				var animate = function (isLeft) {
					var t = isLeft ? left_val + w : left_val - w;
					isLeft ? (iconIdx--) : (iconIdx++);
					left_val = t;
					$box.animate({
						"transform": "translateX(" + t + "px)"
					}, 400, 'ease-in-out', function () {
						if (-t == w * (len - 1)) {
							left_val = -w * (len / 2 - 1);
							$box.css({
								"transition-duration": "0s",
								"transform": "translateX(" + left_val + "px)"
							});
						}
						if (t == 0) {
							left_val = -w * (len / 2);
							$box.css({
								"transition-duration": "0s",
								"transform": "translateX(" + left_val + "px)"
							});
						}
						//console.log();
						if (iconIdx >= len / 2) {
							iconIdx = 0;
						}
						if (iconIdx <= -1) {
							iconIdx = len / 2 - 1;
						}
						$icon.find("li").removeClass("active").eq(iconIdx).addClass("active");
					});
				}
				$list.bind("touchend", function () {
					var isLeft = x1 - x > 0;
					var val = Math.abs(x1 - x);
					if (val >= w / 4) {
						animate(isLeft);
					} else {
						$box.css({
							transition: "All 0s ease-in-out",
							"transform": "translateX(" + left_val + "px)"
						});
					}
					clearInterval(timer);
					timer = setInterval(autoRun, 2000);
				});
				function autoRun() {
					animate(false);
				}

				clearInterval(timer);
				timer = setInterval(autoRun, 2000);
			}
		},
		//公告
		notice: {
			init: function ($node) {
				var w = $node.find("span").width();
				if (w + 40 > pre.window.w) {
					var ms = parseInt(w / pre.window.w) * 15;//15s 一屏宽度
					//alert("mra "+ms+"s linear infinite");
					$node.find("span").css({
						"animation": "mra " + ms + "s linear infinite",
						"-webkit-animation": "mra " + ms + "s linear infinite"
					});
				}
			}
		}
	};
	$(function () {
		//图片广告--左右滑动
		if ($(".type-carousel").length) {
			$.each($(".type-carousel"), function () {
				pre.imgAd.init($(this));
			})
		}
		//商品搜索
		$("#searchFrom input").bind("focus", function () {
			$(this).bind("keydown", function (e) {
				// 回车键事件
				if (e.which == 13) {
					var val = this.value;
					if ($.trim(val)) {
						$("#searchFrom")[0].submit();
					}
				}
			});
		})
		//搜索页搜索
		var $searchText = $("#searchText");
		if ($searchText.length) {
			$("#searchText").bind("focus", function () {
				$(this).bind("keydown", function (e) {
					// 回车键事件
					if (e.which == 13) {
						pre.goodsSearch.getData({pageIndex: 1});
					}
				});
			})
			if ($("#searchText").val()) {
				pre.goodsSearch.getData({pageIndex: 1});
			}
		}
		if ($(".search-result").length) {
			if (!$(".search-result ul").length) {
				$(".search-result").append("<ul></ul>");
			}
			if (!$(".search-result .pages-loading").length) {
				$(".search-result").append('<div class="pages-loading"></div>');
			}
			pre.goodsSearch.bindEvent();
		}
		//公告--超过屏宽，滚动
		$.each($(".sty-notice"), function () {
			pre.notice.init($(this));
		})
		//商品搜索-上一页
		$(".pages-search .up-page").bind("tap", function () {
			pre.goodsSearch.getDataByPage($(this), 0);
		})
		//商品搜索-下一页
		$(".pages-search .next-page").bind("tap", function () {
			pre.goodsSearch.getDataByPage($(this), 1);
		})
	})
})(window);