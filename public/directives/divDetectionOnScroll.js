contactAPP.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
      
        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 100) {
                 scope.belowTop = true;
                 //console.log('Scrolled below top.');
             } else {
                 scope.belowTop = false;
                 //console.log('top is in view.');
             }
            scope.$apply();
        });
    };
});