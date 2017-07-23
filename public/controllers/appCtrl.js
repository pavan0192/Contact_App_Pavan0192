contactAPP.controller('appCtrl',['$scope', '$location', 'usSpinnerService', '$rootScope', '$timeout', function($scope, $location, usSpinnerService, $rootScope, $timeout){
	
	console.log("IN APP CTRL!!!",$location.path());	
	// Spinner is activated and deactivated with respect to the states,In case more states are added,or during the transition between states. 
	
	//flag varible for the spinner make it true or false with respect to requirments.
	$scope.spinneractive = true;
	
	
	
	 $scope.isActive = function() {
        return $location.path();//to attain the current path
    };	
	
	//function to start the spinner
	$scope.startSpin = function() {
        usSpinnerService.spin('spinner-1');
		$scope.spinneractive = true;
    };
	
	//function to end the spinner
	$scope.stopSpin = function() {
        usSpinnerService.stop('spinner-1');
		$scope.spinneractive = false;
    };	
	
	$scope.startSpin();
	
	//To activate the spinner for a required time.
	$timeout(function () {
        $scope.stopSpin();
    },200);
}]);