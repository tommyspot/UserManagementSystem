/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../model/UserModel.ts" />
/// <reference path="../model/GroupModel.ts" />
/// <reference path="../services/PouchDBService.ts" />
/// <reference path="../helpers/ModelHelper.ts" />

module Rockstars.Controller {
  import model = Rockstars.Model;
  import service = Rockstars.Service;
  import helper = Rockstars.Helper;

  export class GroupController {
    public pouchDBService: service.PouchDBService;
    public modelHelper: helper.ModelHelper;
    public groupList: Array<model.GroupModel>;
    public groupListTmp: Array<model.GroupModel>;
    public currentGroup: model.GroupModel;

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
      private $routeParams: any) {

      $scope.viewModel = this;
      this.pouchDBService = new service.PouchDBService($q);
      this.modelHelper = new helper.ModelHelper();

      this.pageSize = 5;
      this.initPage();

      var self = this;
      $scope.$watch('searchText', function (value) {
        if (self.groupListTmp && self.groupListTmp.length > 0) {
          self.groupList = $filter('filter')(self.groupListTmp, value);
          self.initPagination();
        }
      });
    }

    initPage() {
      var group_id = this.$routeParams.group_id;

      if (group_id) {
          if (this.$location.path() === '/group/edit/' + group_id) {//Edit Group
            this.pouchDBService.getEntityById(Enum.EntityType.Group, group_id).then((entity: model.GroupModel) => {
              this.currentGroup = entity;
            }, (reason) => { });
          }
      }
      else {
        if (this.$location.path() === '/group') { //Group
            this.initGroupList();
          } else if (this.$location.path() === '/group/add') { //Add Group
            this.currentGroup = new model.GroupModel();
          }
      }

    }

    initGroupList() {
      this.pouchDBService.getAll(Enum.EntityType.Group).then((data: Array<model.GroupModel>) => {
        this.groupList = data;
        this.groupListTmp = this.groupList;
        this.initPagination();
      }, (reason) => { });
    }

    initPagination() {
      this.currentPage = 1;
      this.numOfPages = this.groupList.length % this.pageSize === 0 ?
        this.groupList.length / this.pageSize : Math.floor(this.groupList.length / this.pageSize) + 1;
    }

    directToGroupForm() {
      this.$location.path('/group/add');
    }

    addGroup(groupModel: model.GroupModel) {
      this.pouchDBService.addEntity(groupModel).then((data) => {
        this.$location.path('/group');
      }, (reason) => { });
    }

    removeGroup() {
      var confirmDialog = this.$window.confirm('Do you want to delete the group?');
      if (confirmDialog) {
        for (let i = 0; i < this.groupList.length; i++) {
          var group = this.groupList[i];
          if (group.isChecked) {
            this.pouchDBService.deleteEntity(group).then((data) => {
              this.initGroupList();
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

    getGroupListOnPage() {
      if (this.groupList && this.groupList.length > 0) {
        var startIndex = this.pageSize * (this.currentPage - 1);
        var endIndex = startIndex + this.pageSize;
        return this.groupList.slice(startIndex, endIndex);
      }
    }

    selectAllGroupsOnPage() {
      var groupOnPage = this.getGroupListOnPage();
      if(groupOnPage && groupOnPage.length > 0){
        for (let index = 0; index < groupOnPage.length; index++) {
          var group = groupOnPage[index];
          group.isChecked = this.isCheckedAll;
        }
      }
    }

    removeOneGroup(group: model.GroupModel) {
      var confirmDialog = this.$window.confirm('Do you want to delete the group?');
      if (confirmDialog) {
          this.pouchDBService.deleteEntity(group).then((data) => {
            this.$location.path('/group');
          }, (reason) => { });
      }
    }

    updateGroup(group: model.GroupModel){
      this.pouchDBService.updateEntity(group).then((data) => {
        this.$location.path('/group');
      }, (reason) => { });
    }

  }
}
