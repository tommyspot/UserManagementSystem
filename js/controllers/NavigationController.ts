/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />

module Rockstars.Controller {
  import service = Rockstars.Service;

  export class NavigationController {
    public nav: any;
    public authentication: service.AuthenticationService;

    constructor(private $scope: ng.IScope,
      private $q: ng.IQService,
      private $location: ng.ILocationService,
      private $cookies: ng.ICookiesService) {

      this.authentication = new Service.AuthenticationService($q, $location, $cookies);
      $scope.viewModel = this;
      this.initNavigation();
    }

    initNavigation() {
      if (this.authentication.hasAdminPermission()) {
        this.nav = {
          navItems: ['user', 'group', 'configuration'],
          selectedIndex: this.$location.path() === '/user' ? 0 : (this.$location.path() === '/group' ? 1 : 2),
          navClick: ($index: number) => {
            this.nav.selectedIndex = $index;
          }
        };

      } else {
        this.nav = {
          navItems: ['user', 'group'],
          selectedIndex: this.$location.path() === '/user' ? 0 : 1,
          navClick: ($index: number) => {
            this.nav.selectedIndex = $index;
          }
        };
      }
    }
  }

}
