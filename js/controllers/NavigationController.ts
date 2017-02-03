/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />

module Rockstars.Controller {

  export class NavigationController {
    public nav: any;
    public authentication: Service.AuthenticationService;

    constructor(private $scope: ng.IScope, 
      private $q: ng.IQService,
      private $location: ng.ILocationService,
      private $cookies: ng.ICookiesService) {
          
      this.authentication = new Service.AuthenticationService($q, $location, $cookies);
      $scope.viewModel = this;
      this.initNavigation();
    }

    initNavigation() {
        this.nav = {
          navItems: ['user', 'group', 'configuration'],
          selectedIndex: this.$location.path() == '/user' ? 0 : (this.$location.path() == '/group' ? 1 : 2),
          navClick: ($index: number) => {
            this.nav.selectedIndex = $index;
          }
        };
    }

    logOut(){
      this.authentication.logOut();
    }
  }

}
