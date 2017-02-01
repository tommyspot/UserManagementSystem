/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />

module Rockstars.Controller {

  export class NavigationController {
    public nav: any;

    constructor(private $scope: ng.IScope,
        private $location: ng.ILocationService) {
          
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
  }

}
