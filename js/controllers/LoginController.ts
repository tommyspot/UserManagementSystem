/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />

module Rockstars.Controller {
  import model = Rockstars.Model;
  //import service = Clarity.Service;

  // export interface IRootLoginControllerScope extends Clarity.Controller.IRootScope {
  //   user: userModel;
  //   returnUrl: string;
  // }

  export class LoginController {
    public user: model.UserModel;

    constructor(private $scope: ng.IScope,
      private $location: ng.ILocationService,
      private $window: ng.IWindowService,
      private $rootScope: ng.IRootScopeService,
      private $http: ng.IHttpService,
      private $cookieStore: ng.ICookieStoreService) {
      $scope.viewModel = this;
    }

    submit() {
      this.$location.path('/user');
    }

  }
}
