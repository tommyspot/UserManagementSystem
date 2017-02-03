var myApp = angular.module('myApp', ['ngRoute', 'ngCookies', '720kb.datepicker'])

//ng-route config
.config(function ($routeProvider, $locationProvider){
	$routeProvider
		.when('/login', {
			templateUrl: '/html/login.html',
			controller: 'LoginController',
			access: 'public'
		})
		.when('/user', {
			templateUrl: '/html/user.html',
			controller: 'UserController',
			access: 'auth'
		})
		.when('/user/add', {
			templateUrl: '/html/user_form.html',
			controller: 'UserController',
			access: 'auth'
		})
		.when('/user/:user_id', {
		  templateUrl: '/html/user_detail.html',
		  controller: 'UserController',
		  access: 'auth'
		})
		.when('/user/edit/:user_id', {
		  templateUrl: '/html/user_form.html',
		  controller: 'UserController',
		  access: 'auth'
		})
		.when('/group', {
			templateUrl: '/html/group.html',
			controller: 'GroupController',
			access: 'auth'
		})
		.when('/group/add', {
			templateUrl: '/html/group_form.html',
			controller: 'GroupController',
			access: 'auth'
		})
		.when('/group/edit/:group_id', {
		  templateUrl: '/html/group_form.html',
		  controller: 'GroupController',
		  access: 'auth'
		})
		// .when('/database', {
		//   templateUrl: '/html/database.html',
		//   controller: 'DatabaseController'
		// })
		.otherwise({redirectTo: '/login'});
});

myApp.directive('convertToNumber', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, ngModel) {
			ngModel.$parsers.push(function (val) {
				return parseInt(val, 10);
			});
			ngModel.$formatters.push(function (val) {
				if (val === undefined)
					return '';
				return '' + val;
			});
		}
	};
});


myApp.run(function ($rootScope, $routeParams, $location, authenticationService) {
	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		if(next.access === 'auth' && !authenticationService.isAuthenticated()){
			$location.path('/login');
		}
		$rootScope.locationPath = $location.path();
  	});
});

myApp.controller('NavigationController', Rockstars.Controller.NavigationController);
myApp.controller('LoginController', Rockstars.Controller.LoginController);
myApp.controller('UserController', Rockstars.Controller.UserController);
myApp.controller('GroupController', Rockstars.Controller.GroupController);
myApp.service('PouchDBSerive', Rockstars.Service.PouchDBService);
myApp.service('authenticationService', Rockstars.Service.AuthenticationService);


