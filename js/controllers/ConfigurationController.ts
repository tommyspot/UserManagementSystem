/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />
/// <reference path="../services/AuthenticationService.ts" />

module Rockstars.Controller {
  import model = Rockstars.Model;
  import service = Rockstars.Service;

  export class ConfigurationController {
    public pouchDBService: service.PouchDBService;
    public dbURL: string;
    public expireTime: number;
    public errorMessage: string;

    constructor(private $scope: ng.IScope,
      private $location: ng.ILocationService,
      private $window: ng.IWindowService,
      private $http: ng.IHttpService,
      private $q: ng.IQService,
      private $cookies: ng.ICookiesService) {

      this.pouchDBService = new service.PouchDBService($q, $cookies);
      $scope.viewModel = this;
      this.initPage();
    }

    initPage() {
      this.expireTime = this.$cookies.get('expireTime') ? parseInt(this.$cookies.get('expireTime')) : null;
      this.dbURL = this.$cookies.get('dbURL');
    }

    saveConfig() {
      this.updateDbURL();
      this.updateExpireTime();
    }

    updateDbURL() {
      this.$cookies.remove('dbURL');
      this.$cookies.put('dbURL', this.dbURL);
    }

    updateExpireTime() {
      if (this.expireTime) {
        var userLogin = this.$cookies.getObject('user');
        this.$cookies.remove('user');
        this.$cookies.remove('expireTime');
        this.$cookies.put('expireTime', this.expireTime.toString());

        var toDay = new Date().getTime();
        var expireDate = new Date(toDay + this.expireTime);
        var option = { 'expires': expireDate };
        this.$cookies.putObject('user', userLogin, option);
      }
    }

  }
}
