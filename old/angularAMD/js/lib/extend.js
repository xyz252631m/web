/**
 * @author wwei
 * @date 2015年12月16日
 * @version V1.0
 * @des 新建指令xmClass，修复ngClass不兼容ie7, 用法同ngClass
 * 新建服务 upload,文件异步上传
 * 新建服务 pager ,ajax分页
 * 新建服务 xmElement ，添加、删除样式
 * 新建过滤器 lengthSize，以英文字符length为准
 * 新建指令 fileChange，绑定input[type=file] 的change事件，依赖ngModel
 * 新建指令 xmDate,调用mydate97
 *
 */
(function (window, angular) {
	var isString = angular.isString, isArray = angular.isArray, isDate = angular.isDate, isFunction = angular.isFunction;
	var lowercase = function (string) {
		return isString(string) ? string.toLowerCase() : string;
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;
	var msie = int((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
	if (isNaN(msie)) {
		msie = int((/trident\/.*; rv:(\d+)/.exec(lowercase(navigator.userAgent)) || [])[1]);
	}
	function int(str) {
		return parseInt(str, 10);
	}

	var trim = (function () {
		if (!String.prototype.trim) {
			return function (value) {
				return isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
			};
		}
		return function (value) {
			return isString(value) ? value.trim() : value;
		};
	})();

	function equals(o1, o2) {
		if (o1 === o2) return true;
		if (o1 === null || o2 === null) return false;
		if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
		var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
		if (t1 == t2) {
			if (t1 == 'object') {
				if (isArray(o1)) {
					if (!isArray(o2)) return false;
					if ((length = o1.length) == o2.length) {
						for (key = 0; key < length; key++) {
							if (!equals(o1[key], o2[key])) return false;
						}
						return true;
					}
				} else if (isDate(o1)) {
					return isDate(o2) && o1.getTime() == o2.getTime();
				} else if (isRegExp(o1) && isRegExp(o2)) {
					return o1.toString() == o2.toString();
				} else {
					if (isScope(o1) || isScope(o2) || isWindow(o1) || isWindow(o2) || isArray(o2)) return false;
					keySet = {};
					for (key in o1) {
						if (key.charAt(0) === '$' || isFunction(o1[key])) continue;
						if (!equals(o1[key], o2[key])) return false;
						keySet[key] = true;
					}
					for (key in o2) {
						if (!keySet.hasOwnProperty(key) &&
							key.charAt(0) !== '$' &&
							o2[key] !== undefined && !isFunction(o2[key])) return false;
					}
					return true;
				}
			}
		}
		return false;
	}

	function isRegExp(value) {
		return toString.call(value) === '[object RegExp]';
	}

	function isWindow(obj) {
		return obj && obj.document && obj.location && obj.alert && obj.setInterval;
	}

	function isScope(obj) {
		return obj && obj.$evalAsync && obj.$watch;
	}

	function jqLiteHasClass(element, selector) {
		if (!element.getAttribute) return false;
		if (msie && msie <= 8) {
			return ((" " + (element.className || '') + " ").replace(/[\n\t]/g, " ").
				indexOf(" " + selector + " ") > -1);
		} else {
			return ((" " + (element.getAttribute('class') || '') + " ").replace(/[\n\t]/g, " ").
				indexOf(" " + selector + " ") > -1);
		}
	}

	function jqLiteRemoveClass(element, cssClasses) {
		if (msie && msie <= 8) {
			if (cssClasses) {
				angular.forEach(cssClasses.split(' '), function (cssClass) {
					element.className = trim(
						(" " + element.className + " ")
							.replace(/[\n\t]/g, " ")
							.replace(" " + trim(cssClass) + " ", " ")
					);
				});
			}
		} else {
			if (cssClasses && element.setAttribute) {
				angular.forEach(cssClasses.split(' '), function (cssClass) {
					element.setAttribute('class', trim(
							(" " + (element.getAttribute('class') || '') + " ")
								.replace(/[\n\t]/g, " ")
								.replace(" " + trim(cssClass) + " ", " "))
					);
				});
			}
		}
	}

	function jqLiteAddClass(element, cssClasses) {
		if (msie && msie <= 8) {
			if (cssClasses) {
				angular.forEach(cssClasses.split(' '), function (cssClass) {
					if (!jqLiteHasClass(element, cssClass)) {
						element.className = trim(element.className + ' ' + trim(cssClass));
					}
				});
			}
		} else {
			if (cssClasses && element.setAttribute) {
				var existingClasses = (' ' + (element.getAttribute('class') || '') + ' ').replace(/[\n\t]/g, " ");
				angular.forEach(cssClasses.split(' '), function (cssClass) {
					cssClass = trim(cssClass);
					if (existingClasses.indexOf(' ' + cssClass + ' ') === -1) {
						existingClasses += cssClass + ' ';
					}
				});

				element.setAttribute('class', trim(existingClasses));
			}
		}
	}


	function getPageNumber(pageIndex, pageCount, num) {
		var list = [];
		var txtNumber = num || 5, minPageIndex = 1, maxPageIndex = 1;// 数字数量
		var numberFlag = Math.floor(txtNumber / 2);
		// 判断起止数字，然后循环
		if (pageIndex - numberFlag <= 1) {
			minPageIndex = 1;
			if (txtNumber > pageCount)
				maxPageIndex = pageCount;
			else {
				maxPageIndex = txtNumber;
			}
		} else {
			minPageIndex = pageIndex - numberFlag;
			if (pageIndex + numberFlag >= pageCount) {
				minPageIndex = pageCount - txtNumber + 1;
				maxPageIndex = pageCount;
			} else {
				maxPageIndex = pageIndex + numberFlag;
			}
		}
		if (minPageIndex <= 0)
			minPageIndex = 1;
		for (var i = minPageIndex; i <= maxPageIndex; i++) {
			list.push(i);
		}
		return list;
	}

	//格式化字符串
	function format(str, data) {
		var result = str;
		for (var key in data) {
			var value = data[key];
			if (undefined != value) {
				result = result.replace(new RegExp("\\{" + key + "\\}", "gm"), value);
			}
		}
		return result;
	}

	angular.module('extend', [])
		.filter("lengthSize", function () {
			function getStrLength(str) {
				var cArr = str.match(/[^\x00-\xff]/ig);
				return str.length + (cArr == null ? 0 : cArr.length);
			}

			return function (str, len) {
				if (str) {
					if (getStrLength(str) > len) {
						return str.substring(0, len / 2 - 3) + "...";
					}
				}
				return str;
			}
		})
		.factory("upload", ["$http", "$document", function ($http, $document) {
			var defaults = {
				before: null,
				success: null,
				error: null,
				method: 'POST',
				dataType: "json",
				url: ""
			};
			function uploadForm(formId, option) {
				var form = document.getElementById(formId);
				var opt = angular.extend({}, defaults, {
					method: form.method,
					url: form.action
				}, option), i = 0, eleName;
				var temId = formId + parseInt(Math.random() * 100);
				function getBefore() {
					if (typeof(opt.before) == "function") {
						opt.before.apply(opt);
					}
				}
				if (typeof(FormData) == "function") {
					var elements = form.elements;
					var fileData = [];
					for (; i < elements.length; i++) {
						eleName = elements[i].name;
						if (eleName) {
							if (elements[i].type == "file") {
								fileData.push({name: eleName, value: elements[i].files[0]});
							} else {
								fileData.push({name: eleName, value: elements[i].value});
							}
						}
					}
					//angular.forEach(opt.data,function(item,key){
					//	fileData.push({name: key, value:item});
					//});
					getBefore();
					$http({
						method: opt.method || 'get',
						url: opt.url,
						headers: {
							'Content-Type': undefined
						},
						transformRequest: function (data) {
							var formData = new FormData(), key;
							for (var i = 0, len = data.data.length; i < len; i++) {
								formData.append(data.data[i].name, data.data[i].value);
							}
							return formData;
						},
						data: {
							data: fileData
						}
					}).success(function (red, status, xhr, fn) {
						opt.success(red, status, xhr, fn);
					}).error(function (red, status) {
						opt.error(red);
					});
				} else {
					var tem_iframe = angular.element("<iframe name='" + temId + "' id='" + temId + "' style='display:none'></iframe>");
					angular.element(document.body).append(tem_iframe);
					function jsonResult(data) {
						var result = data;
						if (opt.dataType == "json") {
							result = JSON.parse(data);
						}
						return result;
					}

					function remove() {
						angular.element(document.getElementById(temId)).remove();
					}
					tem_iframe[0].onload = function () {
						var red = tem_iframe[0].contentWindow.document.body.innerHTML;
						var pre = tem_iframe[0].contentWindow.document.getElementsByTagName("pre")[0];
						if (pre) {
							red = pre.innerHTML;
						}
						try {
							opt.success(jsonResult(red));
						} catch (e) {
							opt.error(red);
						}
						remove();
					}
					var iframe = document.createElement("iframe");
					form.action = opt.url;
					form.method = opt.method;
					form.setAttribute("target", temId);
					getBefore();
					form.submit();

				}
			}

			return {file: uploadForm};
		}])
		.factory("xmElement", function () {
			return {
				addClass: function (selector, cssClasses) {
					if (angular.isElement(selector) && selector.length) {
						for (var i = 0, len = selector.length; i < len; i++) {
							jqLiteAddClass(selector[i], cssClasses);
						}
					} else {
						jqLiteAddClass(angular.element(selector)[0], cssClasses);
					}
				},
				removeClass: function (selector, cssClasses) {
					if (angular.isElement(selector) && selector.length) {
						for (var i = 0, len = selector.length; i < len; i++) {
							jqLiteRemoveClass(selector[i], cssClasses);
						}
					} else {
						jqLiteRemoveClass(angular.element(selector)[0], cssClasses);
					}
				},
				hasClass: function (selector, cssClasses) {
					if (angular.isElement(selector) && selector.length) {
						return jqLiteHasClass(selector[0], cssClasses);
					} else {
						return jqLiteHasClass(selector, cssClasses);
					}

				}
			}
		})
		.factory("pager", ["$http", function ($http) {
			var opts = {
				url:"",
				numCount: 5,
				pageIndex: 1,
				pageSize: 10,
				params:null,
				data: null,
				list: [],
				listCount: 0,
				loadFn: null,
				success: null,
				dataType:"json",//传入数据格式  默认为json 可设置为string
				error: null
			};
			var page = {
				pageShow: false,
				size: 10,
				index: 1,
				count: 0,
				list: {}
			};
			function initPager() {
				var listCount = opts.listCount;
				page.pageShow = true;
				page.count = Math.ceil(listCount / opts.pageSize);
				// 页码数列表
				var getPageList = function () {
					var list = getPageNumber(opts.pageIndex, page.count, opts.numCount);
					return {num: list, select: page.index};
				}
				page.list = getPageList();
			}
			// 更新
			function update() {
				if(page.count>0&&opts.pageIndex>page.count){
					opts.pageIndex=page.count;
				}
				page.index = opts.pageIndex;
				var url = format(opts.url, {pageIndex: opts.pageIndex, pageSize: opts.pageSize});
				var postConfig = {};
				if(opts.params){
					postConfig.params=opts.params;
				}
				if(opts.dataType=="string"){
					postConfig.params=null;
					if(!opts.data&&opts.params){
						opts.data=opts.params;
					}
					postConfig.headers={'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'},
						postConfig.transformRequest=function(obj){
							var str = [];
							for(var p in obj){
								str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							}
							return str.join("&");
						}
				}
				$http.post(url, opts.data,postConfig).success(function (red) {
					if (typeof(opts.success) == "function") {
						opts.success(red, opts);
						opts.success=null;
						opts.listCount = red.total||0;
						initPager();
					}
				}).error(function () {

				});
			}
			// 首页按钮
			page.firstPage = function () {
				opts.pageIndex= 1;
				update();
			}
			//{'active':a==page.list.select}
			page.getClass = function (a) {
				return a == 1 ? 'active' : '';
			}
			// 上一页按钮
			page.upPage = function () {
				if (opts.pageIndex <= 1) {
					return;
				}
				opts.pageIndex--;
				update();
			}
			// 下一页按钮
			page.downPage = function () {
				if (opts.pageIndex >= page.count) {
					return;
				}
				opts.pageIndex++;
				update();
			}
			// 末页按钮
			page.lastPage = function () {
				opts.pageIndex = page.count;
				update();
			}
			// 数字按钮
			page.pageClick = function (m) {
				opts.pageIndex = m;
				update();
			};
			return {
				config: function (option) {
					angular.extend(opts, option);
					return page;
				},
				post: function (url, data, successFn, option) {
					opts.pageIndex=1;
					angular.extend(opts, {url: url, success: successFn, data: data}, option);
					update();
					return page;
				},
				reset: function () {
					opts.pageIndex=1;
					update();
				},
				update: update
			}
		}])
		.directive('fileChange', ['$parse', function ($parse) {
			return {
				require: 'ngModel',
				restrict: 'A',
				link: function ($scope, element, attr, ngModel) {
					var changeFn = $parse(attr['fileChange']);
					var handler = function (e) {
						changeFn($scope, {$event: e, files: e.target.files});
					};
					element.bind("change", handler);
				}
			};
		}])
		.directive("xmDate",function(){
			return {
				require: 'ngModel',
				link : function(scope, element, attr, ctrl) {
					element.bind("click",function(){
						WdatePicker({onpicked:function(dp){
							ctrl.$setViewValue(dp.cal.getDateStr());
						},onclearing:function(){
							ctrl.$setViewValue("");
						}
						});
					});
				}
			}
		})
		.directive("xmClass", [function () {
			var name = 'xmClass';
			var selector = true;

			function arrayDifference(tokens1, tokens2) {
				var values = [];

				outer:
					for (var i = 0; i < tokens1.length; i++) {
						var token = tokens1[i];
						for (var j = 0; j < tokens2.length; j++) {
							if (token == tokens2[j]) continue outer;
						}
						values.push(token);
					}
				return values;
			}

			function arrayClasses(classVal) {
				if (isArray(classVal)) {
					return classVal;
				} else if (isString(classVal)) {
					return classVal.split(' ');
				} else if (angular.isObject(classVal)) {
					var classes = [], i = 0;
					angular.forEach(classVal, function (v, k) {
						if (v) {
							classes = classes.concat(k.split(' '));
						}
					});
					return classes;
				}
				return classVal;
			}

			function shallowCopy(src, dst) {
				if (isArray(src)) {
					dst = dst || [];

					for (var i = 0; i < src.length; i++) {
						dst[i] = src[i];
					}
				} else if (angular.isObject(src)) {
					dst = dst || {};

					for (var key in src) {
						if (hasOwnProperty.call(src, key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
							dst[key] = src[key];
						}
					}
				}
				return dst || src;
			}

			return {
				restrict: 'AC',
				link: function (scope, element, attr) {
					var oldVal;
					scope.$watch(attr[name], ngClassWatchAction, true);
					attr.$observe('class', function (value) {
						ngClassWatchAction(scope.$eval(attr[name]));
					});
					if (name !== 'ngClass') {
						scope.$watch('$index', function ($index, old$index) {
							// jshint bitwise: false
							var mod = $index & 1;
							if (mod !== (old$index & 1)) {
								var classes = arrayClasses(scope.$eval(attr[name]));
								mod === selector ?
									addClasses(classes) :
									removeClasses(classes);
							}
						});
					}

					function addClasses(classes) {
						var newClasses = digestClassCounts(classes, 1);
						jqLiteAddClass(element[0], newClasses);
						//attr.$addClass(newClasses);
					}

					function removeClasses(classes) {
						var newClasses = digestClassCounts(classes, -1);
						jqLiteRemoveClass(element[0], newClasses);
						//attr.$removeClass(newClasses);
					}

					function digestClassCounts(classes, count) {
						var classCounts = element.data('$classCounts') || {};
						var classesToUpdate = [];
						angular.forEach(classes, function (className) {
							if (count > 0 || classCounts[className]) {
								classCounts[className] = (classCounts[className] || 0) + count;
								if (classCounts[className] === +(count > 0)) {
									classesToUpdate.push(className);
								}
							}
						});
						element.data('$classCounts', classCounts);
						return classesToUpdate.join(' ');
					}

					function updateClasses(oldClasses, newClasses) {
						var toAdd = arrayDifference(newClasses, oldClasses);
						var toRemove = arrayDifference(oldClasses, newClasses);
						toRemove = digestClassCounts(toRemove, -1);
						toAdd = digestClassCounts(toAdd, 1);

						if (toAdd.length === 0) {
							//$animate.removeClass(element, toRemove);
							jqLiteRemoveClass(element[0], toRemove);
						} else if (toRemove.length === 0) {
							//$animate.addClass(element, toAdd);
							jqLiteAddClass(element[0], toAdd);
						} else {
							//$animate.setClass(element, toAdd, toRemove);
							angular.forEach(element[0], function (element) {
								jqLiteAddClass(element, toAdd);
								jqLiteRemoveClass(element, toRemove);
							});
						}
					}

					function ngClassWatchAction(newVal) {
						if (selector === true || scope.$index % 2 === selector) {
							var newClasses = arrayClasses(newVal || []);
							if (!oldVal) {
								addClasses(newClasses);
							} else if (!equals(newVal, oldVal)) {
								var oldClasses = arrayClasses(oldVal);
								updateClasses(oldClasses, newClasses);
							}
						}
						oldVal = shallowCopy(newVal);
					}

					//end
				}
			}
		}]);
})(window, window.angular);

