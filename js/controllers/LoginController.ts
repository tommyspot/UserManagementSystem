/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />
/// <reference path="../services/AuthenticationService.ts" />

module Rockstars.Controller {
  import model = Rockstars.Model;
  import service = Rockstars.Service;

  export class LoginController {
    public userLogin: model.UserLoginModel;
    public authentication: service.AuthenticationService;
    public errorMessage: string;

    constructor(private $scope: ng.IScope,
      private $location: ng.ILocationService,
      private $window: ng.IWindowService,
      private $rootScope: ng.IRootScopeService,
      private $http: ng.IHttpService,
      private $q: ng.IQService,
      private $cookies: ng.ICookiesService) {

      this.authentication = new service.AuthenticationService($q, $location, $cookies);
      $scope.viewModel = this;
    }

    submit() {
      this.authentication.login(this.userLogin, () => {
        this.$location.path('/user');
      }, (error: string) => {
        this.errorMessage = error;
      });
    }

  }
}
