/// <reference path="../lib/angularjs/angular.d.ts" />

module Rockstars.Controller {
  import model = Rockstars.Model;
  //import service = Clarity.Service;

  export class UserController {
    public pouchDBService: Rockstars.Service.PouchDBService;
    public userList: Array<model.UserModel>;
    public userListTmp: Array<model.UserModel>;
    public currentUser: model.UserModel;
    public availableGroups: any;

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
      private $filter: ng.IFilterService) {

      $scope.viewModel = this;
      this.pouchDBService = new Rockstars.Service.PouchDBService($q);
      this.pageSize = 5;
      this.initPage();

      var self = this;
      $scope.$watch('searchText', function(value)
      { 
        if(self.userListTmp && self.userListTmp.length >0){
          //self.userList = $filter('filter')(self.userListTmp, {userName: value});
          self.userList = $filter('filter')(self.userListTmp, value);
          self.initPaging();
        }
      });


    }

    initPage() {

      if (this.$location.path() === '/user') {//User list
        this.initUserList();
        
      } else if (this.$location.path() === '/user/add') { //Add user
        this.currentUser = new Rockstars.Model.UserModel();
        this.availableGroups = [
          { id: 1, name: 'Group A' },
          { id: 2, name: 'Group B' },
          { id: 3, name: 'Group C' }
        ];
      }
    }

    initUserList() {
      this.pouchDBService.getAll('user').then((data: Array<model.UserModel>) => {
        this.userList = data;
        this.userList.sort(function(a: any,b: any){
          return b.createdDate - a.createdDate;
        });
        this.userListTmp = this.userList;
        this.initPaging();
      }, (reason) => { }
      );
    }

    initPaging(){   
      this.currentPage = 1;
      this.numOfPages = this.userList.length % this.pageSize === 0 ?
                            this.userList.length/this.pageSize : Math.floor(this.userList.length/this.pageSize) + 1;
    }

    directToUserForm() {
      this.$location.path('/user/add');
    }

    addUser(userModel: Rockstars.Model.UserModel) {
      userModel.createdDate = new Date();

      this.pouchDBService.addEntity(userModel).then((data) => {
        this.$location.path('/user');
      }, (reason) => { });
    }

    removeUser() {
      var confirmDialog = this.$window.confirm('Do you want to delete the user?');
      if(confirmDialog){
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

    getUserRole(role: number) {
      return role === 0 ? 'Admin' : (role === 1 ? 'Editor' : 'View');
    }

    getNumberPage() {
      if(this.numOfPages > 0){
        return new Array(this.numOfPages);   
      }
      return new Array(0);   
    }

    goToPage(pageIndex: number){
      this.currentPage = pageIndex;
    }

    goToPreviousPage(){
      if(this.currentPage > 1) {
        this.currentPage--;
        this.goToPage(this.currentPage);
      }
    }
    goToNextPage(){
      if(this.currentPage < this.numOfPages) {
        this.currentPage++;
        this.goToPage(this.currentPage);
      }
    }

    getUserListOnPage(){
      if(this.userList && this.userList.length > 0) {
        var startIndex = this.pageSize * (this.currentPage - 1);  
        var endIndex = startIndex + this.pageSize;
        return this.userList.slice(startIndex, endIndex);
      }
    }

    selectAllUsersOnPage(){
      var userOnPage = this.getUserListOnPage();
      for(let index = 0; index < userOnPage.length; index++){
        var user = userOnPage[index];
        user.isChecked = this.isCheckedAll;
      }

    }

  }



}
