var myApp = angular.module('myApp', ['ngRoute', 'ngCookies'])

//ng-route config
.config(function ($routeProvider, $locationProvider){
	$routeProvider
		.when('/login', {
			templateUrl: '/html/login.html',
			controller: 'LoginController'
		})
		.when('/user', {
			templateUrl: '/html/user.html',
			controller: 'UserController'
		})
		.when('/user/add', {
			templateUrl: '/html/user_form.html',
			controller: 'UserController'
		})
		.when('/user/:user_id', {
		  templateUrl: '/html/user_detail.html',
		  controller: 'UserController'
		})
		.when('/user/edit/:user_id', {
		  templateUrl: '/html/user_form.html',
		  controller: 'UserController'
		})
		.when('/group', {
			templateUrl: '/html/group.html',
			controller: 'GroupController'
		})
		// .when('/add', {
		//   templateUrl: '/html/contact_form.html',
		//   controller: 'AddContactController'
		// })
		// .when('/edit/:contact_id', {
		//   templateUrl: '/html/contact_form.html',
		//   controller: 'EditContactController'
		// })
		// .when('/database', {
		//   templateUrl: '/html/database.html',
		//   controller: 'DatabaseController'
		// })
		.otherwise({redirectTo: '/login'});
})

;

// .controller('LoginController', function ($scope, $routeParams){
	
// });

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


// myApp.config(function ($controllerProvider) {
//   myApp.controller = function (name, constructor) {
//     $controllerProvider.register(name, constructor);
//     return (this);
//   };
// });

myApp.controller('NavigationController', Rockstars.Controller.NavigationController);
myApp.controller('LoginController', Rockstars.Controller.LoginController);
myApp.controller('UserController', Rockstars.Controller.UserController);
myApp.controller('GroupController', Rockstars.Controller.GroupController);

myApp.service('PouchDBSerive', Rockstars.Service.PouchDBService);


