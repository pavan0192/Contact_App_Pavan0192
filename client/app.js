var contactAPP = angular.module('contactAPP', ['ui.router', 'angularValidator', 'angularSpinner','ngFileUpload']);

contactAPP.config(function($stateProvider, $urlRouterProvider) {
	
    $stateProvider	  
	  .state('home2', {
		url: '/home2',		
		templateUrl: '/templates/home2.html',
		controller: 'home2Ctrl'
	  });
		
	  $urlRouterProvider.otherwise('/home2');
});

