/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />
/// <reference path="../model/UserModel.ts" />
/// <reference path="../model/GroupModel.ts" />
/// <reference path="../services/PouchDBService.ts" />
/// <reference path="../helpers/ModelHelper.ts" />

module Rockstars.Controller {
  import model = Rockstars.Model;
  import service = Rockstars.Service;
  import helper = Rockstars.Helper;

  export class UserController {
    public pouchDBService: service.PouchDBService;
    public authenticationService: service.AuthenticationService;
    public modelHelper: helper.ModelHelper;
    public userList: Array<model.UserModel>;
    public userListTmp: Array<model.UserModel>;
    public currentUser: model.UserModel;
    public availableGroups: Array<Model.GroupModel>;

    public numOfPages: number;
    public currentPage: number;
    public pageSize: number;
    public isCheckedAll: boolean;

    constructor(private $scope: ng.IScope,
      private $location: ng.ILocationService,
      private $window: ng.IWindowService,
      private $rootScope: ng.IRootScopeService,
      private $http: ng.IHttpService,
      private $q: ng.IQService,
      private $filter: ng.IFilterService,
      private $routeParams: any,
      private $cookies: ng.ICookiesService) {

      $scope.viewModel = this;
      this.pouchDBService = new service.PouchDBService($q, $cookies);
      this.modelHelper = new helper.ModelHelper();
      this.authenticationService = new service.AuthenticationService($q, $location, $cookies);

      this.pageSize = 5;
      this.initPage();

      var self = this;
      $scope.$watch('searchText', function (value) {
        if (self.userListTmp && self.userListTmp.length > 0) {
          //self.userList = $filter('filter')(self.userListTmp, {userName: value});
          self.userList = $filter('filter')(self.userListTmp, value);
          self.initPagination();
        }
      });
    }

    initPage() {
      var user_id = this.$routeParams.user_id;

      if (user_id) {
        if (this.$location.path() === '/user/' + user_id) { //User Info
          this.pouchDBService.getEntityById(Enum.EntityType.User, user_id).then((entity: model.UserModel) => {
            this.currentUser = entity;
          }, (reason) => { });
          
        } else if (this.$location.path() === '/user/edit/' + user_id) {//Edit User
          this.pouchDBService.getEntityById(Enum.EntityType.User, user_id).then((entity: model.UserModel) => {
            this.currentUser = entity;
          }, (reason) => { });
        }

      } else {
        if (this.$location.path() === '/user') { //User
          this.initUserList();
        } else if (this.$location.path() === '/user/add') { //Add User
          this.currentUser = new model.UserModel();
        }
      }
      
      this.initGroupList();
    }

    initUserList() {
      this.pouchDBService.getAll(Enum.EntityType.User).then((data: Array<model.UserModel>) => {
        this.userList = data;
        this.userList.sort(function (a: any, b: any) {
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        });
        this.userListTmp = this.userList;
        this.initPagination();
      }, (reason) => { });
    }

    initPagination() {
      this.currentPage = 1;
      this.numOfPages = this.userList.length % this.pageSize === 0 ?
        this.userList.length / this.pageSize : Math.floor(this.userList.length / this.pageSize) + 1;
    }

    initGroupList() {
      this.pouchDBService.getAll(Enum.EntityType.Group).then((data: Array<model.GroupModel>) => {
        this.availableGroups = data;
        this.modelHelper = new helper.ModelHelper(null, data);
      }, (reason) => {
        this.availableGroups = [];
      });
    }


    directToUserForm() {
      this.$location.path('/user/add');
    }

    addUser(userModel: model.UserModel) {
      userModel.createdDate = new Date().toString();

      this.pouchDBService.addEntity(userModel).then((data) => {
        this.$location.path('/user');
      }, (reason) => { });
    }

    removeUser() {
      var confirmDialog = this.$window.confirm('Do you want to delete the user?');
      if (confirmDialog) {
        for (let i = 0; i < this.userList.length; i++) {
          var user = this.userList[i];
          if (user.isChecked) {
            this.pouchDBService.deleteEntity(user).then((data) => {
              this.initUserList();
            }, (reason) => { });
          }
        }
      }
    }

    getNumberPage() {
      if (this.numOfPages > 0) {
        return new Array(this.numOfPages);
      }
      return new Array(0);
    }

    goToPage(pageIndex: number) {
      this.currentPage = pageIndex;
    }

    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.goToPage(this.currentPage);
      }
    }
    goToNextPage() {
      if (this.currentPage < this.numOfPages) {
        this.currentPage++;
        this.goToPage(this.currentPage);
      }
    }

    getUserListOnPage() {
      if (this.userList && this.userList.length > 0) {
        var startIndex = this.pageSize * (this.currentPage - 1);
        var endIndex = startIndex + this.pageSize;
        return this.userList.slice(startIndex, endIndex);
      }
    }

    selectAllUsersOnPage() {
      var userOnPage = this.getUserListOnPage();
      for (let index = 0; index < userOnPage.length; index++) {
        var user = userOnPage[index];
        user.isChecked = this.isCheckedAll;
      }
    }

    removeUserInDetail(user: model.UserModel) {
      var confirmDialog = this.$window.confirm('Do you want to delete the user?');
      if (confirmDialog) {
        this.pouchDBService.deleteEntity(user).then((data) => {
          this.$location.path('/user');
        }, (reason) => { });
      }
    }

    updateUser(user: model.UserModel) {
      this.pouchDBService.updateEntity(user).then((data) => {
        this.$location.path('/user');
      }, (reason) => { });
    }



  }



}
