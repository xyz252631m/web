angular.module('starter.directive', [])
  .directive('scrollHeight', function ($window) {
    return {
      restrict: 'AE',
      link: function (scope, element, attr) {
        element[0].style.height = ($window.innerHeight - 0) + 'px';
      }
    }
  })
  .directive("ling", function ($http) {
    return {
      controller: function ($scope) {
        $scope.txt = "讲个笑话";
      },
      link: function (scope, ele, attr) {
        scope.send = function () {
          ele.find("div").append("<p class='m-txt'>" + scope.txt + "</p>")
          var lingData = {
            "key": "82bfc2aebba5403c98392d768110ffd3",
            "info": scope.txt,
            //"loc":"北京市中关村",
            "userid": "123456"
          }
          $http.post("http://www.tuling123.com/openapi/api", lingData).success(function (res) {
            ele.find("div").append("<p>" + res.text + "</p>")
            if (res.url) {
              ele.find("div").append("<p><a target='_blank' href='" + res.url + "'>" + res.url + "</a></p>")
            }
            if (res.list) {
              angular.forEach(res.list, function (item) {
                if (item.article) {
                  ele.find("div").append("<p class='news-item'><a target='_blank' href='" + item.detailurl + "'>" + item.article + " --- " + item.source + "</a></p>")
                  if (item.icon) {
                    ele.find("div").append("<p class='news-item'><img src='" + item.icon + "'/></p>")
                  }
                }
                if (item.name) {
                  ele.find("div").append("<p class='cai-item'><a target='_blank' href='" + item.detailurl + "'>" + item.name + " --- " + item.info + "</a></p>")
                  if (item.icon) {
                    ele.find("div").append("<p class='cai-img'><img src='" + item.icon + "'/></p>")
                  }
                }
              })
            }
            //
            //ele.find("div")[0].scrollIntoView();
            ele.find("div").find("img").bind("load", function () {
              ele.find("div")[0].scrollTop = ele.find("div")[0].scrollHeight;
              this.onload = null;
            })
            ele.find("div")[0].scrollTop = ele.find("div")[0].scrollHeight;
          })
        }
        scope.clear = function () {
          ele.find("div").empty();
        }
      }
    }
  })
