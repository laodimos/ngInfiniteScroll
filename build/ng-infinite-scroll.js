/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$timeout', function ($rootScope, $timeout) {
      return {
          link: function (scope, elem, attrs) {
              var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
              scrollDistance = 0;
              if (attrs.infiniteScrollDistance !== null) {
                  scope.$watch(attrs.infiniteScrollDistance, function (value) {
                      scrollDistance = parseInt(value, 10);
                      return scrollDistance;
                  });
              }
              scrollEnabled = true;
              checkWhenEnabled = false;
              if (attrs.infiniteScrollDisabled !== null) {
                  scope.$watch(attrs.infiniteScrollDisabled, function (value) {
                      scrollEnabled = !value;
                      if (scrollEnabled && checkWhenEnabled) {
                          checkWhenEnabled = false;
                          return handler();
                      }
                  });
              }
              handler = function () {
                  var elementBottom, remaining, shouldScroll, windowBottom;
                  windowBottom = $(elem).height() + $(elem).scrollTop();
                  elementBottom = $(elem).offset().top + $(elem).height();
                  remaining = elementBottom - windowBottom;
                  shouldScroll = remaining <= scrollDistance;
                  console.log(shouldScroll);
                  console.log("enabled:" + scrollEnabled);
                  if (shouldScroll && scrollEnabled) {
                      if ($rootScope.$$phase) {
                          return scope.$eval(attrs.infiniteScroll);
                      } else {
                          console.log("!");
                          console.log(attrs.infiniteScroll);
                          return scope.$apply(attrs.infiniteScroll);
                      }
                  } else if (shouldScroll) {
                      checkWhenEnabled = true;
                      return checkWhenEnabled;
                  }
              };
              $(elem).on('scroll', handler);
              scope.$on('$destroy', function () {
                  return $window.off('scroll', handler);
              });
              return $timeout((function () {
                  if (attrs.infiniteScrollImmediateCheck) {
                      if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                          return handler();
                      }
                  } else {
                      return handler();
                  }
              }), 0);
          }
      };
  }
]);