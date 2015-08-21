/**
 * @date {2015-8-21}
 * @author xialeistudio <xialeistudio@gmail.com>
 */
'use strict';
(function(w, ng) {
  ng.module('app', [])
    .directive('addressPicker', [
      function() {
        return {
          scope: {
            address: '='
          },
          restrict: 'EA',
          require: 'ngModel',
          templateUrl: 'angular-address-picker.html',
          link: function(scope, ele, attrs, ctrl) {
            var picker = document.querySelector('.address-picker')
              , loadAddress;
            scope.loaded = 0;
            scope.picker = {};
            /**
             * 点击显示浮层
             */
            ele.bind('click', function() {
              document.body.appendChild(picker);
              picker.style.visibility = 'visible';
            });
            /**
             * 加载省市区数据JS
             */
            var script = document.createElement('script');
            script.onload = function() {
              scope.$apply(function() {
                scope.provinces = provinces;
                scope.cityList = cities;
                scope.areaList = areas;
                scope.loaded++;
              });
            };
            script.src = 'data.js';
            document.body.appendChild(script);
            /**
             * 加载CSS
             */
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'angular-address-picker.css';
            document.querySelector('head').appendChild(link);
            /**
             * 选中省份
             * @param provinceId
             */
            scope.selectProvince = function(provinceId) {
              scope.cities = scope.cityList[provinceId];
            };
            /**
             * 选中城市
             * @param cityId
             */
            scope.selectCity = function(cityId) {
              scope.areas = scope.areaList[cityId];
            };
            /**
             * 组装数据
             */
            scope.select = function() {
              var value = scope.picker;
              if (value !== undefined) {
                var address = [];
                if (value.province && scope.provinces) {
                  address.push(scope.provinces[value.province]);
                }
                if (value.city && scope.cities) {
                  address.push(scope.cities[value.city]);
                }
                if (value.district && scope.areas) {
                  address.push(scope.areas[value.district]);
                }
                ctrl.$setViewValue(address.join(' '));
                picker.style.visibility = 'hidden';
              }
            };
            /**
             * 取消选择
             */
            scope.cancel = function() {
              picker.style.visibility = 'hidden';
            };
            /**
             * 值渲染
             */
            ctrl.$render = function() {
              if (ctrl.$viewValue !== undefined) {
                scope.loaded++;
                loadAddress = ctrl.$viewValue;
              }
            };
            /**
             * 地址库和地址数据全部加载完毕
             */
            scope.$watch('loaded', function(value) {
              if (value === 2) {
                var address = loadAddress.split(' ');
                // 省
                if (address[0] === undefined) {
                  return;
                }
                angular.forEach(scope.provinces, function(name, id) {
                  if (address[0] == name) {
                    scope.picker.province = id;
                    scope.selectProvince(id);
                    // 市
                    if (address[1] === undefined) {
                      return;
                    }
                    angular.forEach(scope.cities, function(name, id) {
                      if (address[1] == name) {
                        scope.picker.city = id;
                        scope.selectCity(id);
                        // 区
                        if (address[2] === undefined) {
                          return;
                        }
                        angular.forEach(scope.areas, function(name, id) {
                          if (address[2] == name) {
                            scope.picker.district = id;
                          }
                        })
                      }
                    });
                  }
                });
              }
            });
          }
        }
      }
    ]);
})(window, angular);