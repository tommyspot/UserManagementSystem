var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rockstars;
(function (Rockstars) {
    var Enum;
    (function (Enum) {
        var EntityType;
        (function (EntityType) {
            EntityType[EntityType["User"] = 0] = "User";
            EntityType[EntityType["Group"] = 1] = "Group";
        })(EntityType = Enum.EntityType || (Enum.EntityType = {}));
        var UserRole;
        (function (UserRole) {
            UserRole[UserRole["Admin"] = 0] = "Admin";
            UserRole[UserRole["Editor"] = 1] = "Editor";
            UserRole[UserRole["View"] = 2] = "View";
        })(UserRole = Enum.UserRole || (Enum.UserRole = {}));
    })(Enum = Rockstars.Enum || (Rockstars.Enum = {}));
})(Rockstars || (Rockstars = {}));
/// <reference path="../model/Enum.ts" />
var Rockstars;
(function (Rockstars) {
    var Helper;
    (function (Helper) {
        var ModelHelper = (function () {
            function ModelHelper(userList, groupList) {
                this.userList = userList;
                this.groupList = groupList;
            }
            ModelHelper.prototype.getUserRole = function (role) {
                return role === Rockstars.Enum.UserRole.Admin ? 'Admin' :
                    (role === Rockstars.Enum.UserRole.Editor ? 'Editor' : 'View');
            };
            ModelHelper.prototype.formatCreatedDate = function (date) {
                var dateObject = new Date(date);
                return dateObject.toDateString() + ' ' + dateObject.toLocaleTimeString();
            };
            ModelHelper.prototype.formatShortCreatedDate = function (date) {
                var dateObject = new Date(date);
                return dateObject.toDateString();
            };
            ModelHelper.prototype.getGroupName = function (_id) {
                if (this.groupList && this.groupList.length > 0) {
                    for (var index = 0; index < this.groupList.length; index++) {
                        var group = this.groupList[index];
                        if (group._id === _id) {
                            return group.name;
                        }
                    }
                }
                return '';
            };
            return ModelHelper;
        }());
        Helper.ModelHelper = ModelHelper;
    })(Helper = Rockstars.Helper || (Rockstars.Helper = {}));
})(Rockstars || (Rockstars = {}));
var Rockstars;
(function (Rockstars) {
    var Model;
    (function (Model) {
        var BaseModel = (function () {
            function BaseModel() {
            }
            return BaseModel;
        }());
        Model.BaseModel = BaseModel;
    })(Model = Rockstars.Model || (Rockstars.Model = {}));
})(Rockstars || (Rockstars = {}));
var Rockstars;
(function (Rockstars) {
    var Model;
    (function (Model) {
        var GroupModel = (function (_super) {
            __extends(GroupModel, _super);
            function GroupModel() {
                var _this = _super.call(this) || this;
                _this.type = Rockstars.Enum.EntityType.Group;
                return _this;
            }
            return GroupModel;
        }(Model.BaseModel));
        Model.GroupModel = GroupModel;
    })(Model = Rockstars.Model || (Rockstars.Model = {}));
})(Rockstars || (Rockstars = {}));
/// <reference path="../model/BaseModel.ts" />
/// <reference path="../model/Enum.ts" />
var Rockstars;
(function (Rockstars) {
    var Model;
    (function (Model) {
        var UserModel = (function (_super) {
            __extends(UserModel, _super);
            function UserModel() {
                var _this = _super.call(this) || this;
                _this.type = Rockstars.Enum.EntityType.User;
                return _this;
            }
            return UserModel;
        }(Model.BaseModel));
        Model.UserModel = UserModel;
    })(Model = Rockstars.Model || (Rockstars.Model = {}));
})(Rockstars || (Rockstars = {}));
/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/pouchdb/index.d.ts" />
/// <reference path="../lib/pouchdb/pouch.d.ts" />
var Rockstars;
(function (Rockstars) {
    var Service;
    (function (Service) {
        var PouchDBService = (function () {
            function PouchDBService($q) {
                this.$q = $q;
                this.database = new PouchDB('UserDB');
            }
            PouchDBService.prototype.getAll = function (type) {
                var defer = this.$q.defer();
                this.database.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                    var entityList = [];
                    for (var docRow = 0; docRow < doc.rows.length; docRow++) {
                        var entityDoc = doc.rows[docRow].doc;
                        if (entityDoc.type === type) {
                            entityList.push(entityDoc);
                        }
                    }
                    defer.resolve(entityList);
                });
                return defer.promise;
            };
            ;
            PouchDBService.prototype.getEntityById = function (type, _id) {
                var defer = this.$q.defer();
                this.getAll(type).then(function (result) {
                    for (var index = 0; index < result.length; index++) {
                        var entity = result[index];
                        if (entity._id === _id) {
                            defer.resolve(entity);
                        }
                    }
                }, function (reason) {
                    defer.reject(reason);
                });
                return defer.promise;
            };
            ;
            PouchDBService.prototype.updateEntity = function (entityInfo) {
                var _this = this;
                var defer = this.$q.defer();
                this.database.get(entityInfo._id).then(function (doc) {
                    if (entityInfo.type === Rockstars.Enum.EntityType.User) {
                        var entity = entityInfo;
                        return _this.database.put({
                            _id: entity._id,
                            _rev: entity._rev,
                            type: entity.type,
                            createdDate: entity.createdDate,
                            firstName: entity.firstName,
                            lastName: entity.lastName,
                            email: entity.email,
                            userName: entity.userName,
                            password: entity.password,
                            dateOfBirth: entity.dateOfBirth,
                            groupId: entity.groupId,
                            role: entity.role,
                            notes: entity.notes
                        });
                    }
                    else if (entityInfo.type === Rockstars.Enum.EntityType.Group) {
                        var entity = entityInfo;
                        return _this.database.put({
                            _id: entity._id,
                            _rev: entity._rev,
                            type: entity.type,
                            createdDate: entity.createdDate,
                            name: entity.name,
                            notes: entity.notes
                        });
                    }
                }).then(function (result) {
                    // handle response
                    defer.resolve(result);
                })["catch"](function (reason) {
                    //console.log(reason);
                    defer.reject(reason);
                });
                return defer.promise;
            };
            ;
            PouchDBService.prototype.deleteEntity = function (entity) {
                var _this = this;
                var defer = this.$q.defer();
                this.database.get(entity._id).then(function (doc) {
                    return _this.database.remove(doc._id, doc._rev);
                }).then(function (result) {
                    // handle result
                    defer.resolve(result);
                })["catch"](function (reason) {
                    //console.log(reason);
                    defer.reject(reason);
                });
                return defer.promise;
            };
            ;
            PouchDBService.prototype.addEntity = function (entity) {
                var defer = this.$q.defer();
                this.database.post(entity).then(function (result) {
                    // handle response
                    defer.resolve(result);
                })["catch"](function (reason) {
                    //console.log(reason);
                    defer.reject(reason);
                });
                return defer.promise;
            };
            ;
            //realtime service
            PouchDBService.prototype.autoLoadingOnChanged = function (callback) {
                this.database.changes({
                    since: 'now',
                    live: true
                }).on('change', callback);
            };
            return PouchDBService;
        }());
        Service.PouchDBService = PouchDBService;
    })(Service = Rockstars.Service || (Rockstars.Service = {}));
})(Rockstars || (Rockstars = {}));
/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../model/UserModel.ts" />
/// <reference path="../model/GroupModel.ts" />
/// <reference path="../services/PouchDBService.ts" />
/// <reference path="../helpers/ModelHelper.ts" />
var Rockstars;
(function (Rockstars) {
    var Controller;
    (function (Controller) {
        var model = Rockstars.Model;
        var service = Rockstars.Service;
        var helper = Rockstars.Helper;
        var GroupController = (function () {
            function GroupController($scope, $location, $window, $rootScope, $http, $q, $filter, $routeParams) {
                this.$scope = $scope;
                this.$location = $location;
                this.$window = $window;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$q = $q;
                this.$filter = $filter;
                this.$routeParams = $routeParams;
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
            GroupController.prototype.initPage = function () {
                var _this = this;
                var group_id = this.$routeParams.group_id;
                if (group_id) {
                    if (this.$location.path() === '/group/edit/' + group_id) {
                        this.pouchDBService.getEntityById(Rockstars.Enum.EntityType.Group, group_id).then(function (entity) {
                            _this.currentGroup = entity;
                        }, function (reason) { });
                    }
                }
                else {
                    if (this.$location.path() === '/group') {
                        this.initGroupList();
                    }
                    else if (this.$location.path() === '/group/add') {
                        this.currentGroup = new model.GroupModel();
                    }
                }
            };
            GroupController.prototype.initGroupList = function () {
                var _this = this;
                this.pouchDBService.getAll(Rockstars.Enum.EntityType.Group).then(function (data) {
                    _this.groupList = data;
                    _this.groupListTmp = _this.groupList;
                    _this.initPagination();
                }, function (reason) { });
            };
            GroupController.prototype.initPagination = function () {
                this.currentPage = 1;
                this.numOfPages = this.groupList.length % this.pageSize === 0 ?
                    this.groupList.length / this.pageSize : Math.floor(this.groupList.length / this.pageSize) + 1;
            };
            GroupController.prototype.directToGroupForm = function () {
                this.$location.path('/group/add');
            };
            GroupController.prototype.addGroup = function (groupModel) {
                var _this = this;
                this.pouchDBService.addEntity(groupModel).then(function (data) {
                    _this.$location.path('/group');
                }, function (reason) { });
            };
            GroupController.prototype.removeGroup = function () {
                var _this = this;
                var confirmDialog = this.$window.confirm('Do you want to delete the group?');
                if (confirmDialog) {
                    for (var i = 0; i < this.groupList.length; i++) {
                        var group = this.groupList[i];
                        if (group.isChecked) {
                            this.pouchDBService.deleteEntity(group).then(function (data) {
                                _this.initGroupList();
                            }, function (reason) { });
                        }
                    }
                }
            };
            GroupController.prototype.getNumberPage = function () {
                if (this.numOfPages > 0) {
                    return new Array(this.numOfPages);
                }
                return new Array(0);
            };
            GroupController.prototype.goToPage = function (pageIndex) {
                this.currentPage = pageIndex;
            };
            GroupController.prototype.goToPreviousPage = function () {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.goToPage(this.currentPage);
                }
            };
            GroupController.prototype.goToNextPage = function () {
                if (this.currentPage < this.numOfPages) {
                    this.currentPage++;
                    this.goToPage(this.currentPage);
                }
            };
            GroupController.prototype.getGroupListOnPage = function () {
                if (this.groupList && this.groupList.length > 0) {
                    var startIndex = this.pageSize * (this.currentPage - 1);
                    var endIndex = startIndex + this.pageSize;
                    return this.groupList.slice(startIndex, endIndex);
                }
            };
            GroupController.prototype.selectAllGroupsOnPage = function () {
                var groupOnPage = this.getGroupListOnPage();
                if (groupOnPage && groupOnPage.length > 0) {
                    for (var index = 0; index < groupOnPage.length; index++) {
                        var group = groupOnPage[index];
                        group.isChecked = this.isCheckedAll;
                    }
                }
            };
            GroupController.prototype.removeOneGroup = function (group) {
                var _this = this;
                var confirmDialog = this.$window.confirm('Do you want to delete the group?');
                if (confirmDialog) {
                    this.pouchDBService.deleteEntity(group).then(function (data) {
                        _this.$location.path('/group');
                    }, function (reason) { });
                }
            };
            GroupController.prototype.updateGroup = function (group) {
                var _this = this;
                this.pouchDBService.updateEntity(group).then(function (data) {
                    _this.$location.path('/group');
                }, function (reason) { });
            };
            return GroupController;
        }());
        Controller.GroupController = GroupController;
    })(Controller = Rockstars.Controller || (Rockstars.Controller = {}));
})(Rockstars || (Rockstars = {}));
/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />
var Rockstars;
(function (Rockstars) {
    var Controller;
    (function (Controller) {
        //import service = Clarity.Service;
        // export interface IRootLoginControllerScope extends Clarity.Controller.IRootScope {
        //   user: userModel;
        //   returnUrl: string;
        // }
        var LoginController = (function () {
            function LoginController($scope, $location, $window, $rootScope, $http, $cookieStore) {
                this.$scope = $scope;
                this.$location = $location;
                this.$window = $window;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$cookieStore = $cookieStore;
                $scope.viewModel = this;
            }
            LoginController.prototype.submit = function () {
                this.$location.path('/user');
            };
            return LoginController;
        }());
        Controller.LoginController = LoginController;
    })(Controller = Rockstars.Controller || (Rockstars.Controller = {}));
})(Rockstars || (Rockstars = {}));
/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />
var Rockstars;
(function (Rockstars) {
    var Controller;
    (function (Controller) {
        var NavigationController = (function () {
            function NavigationController($scope, $location) {
                this.$scope = $scope;
                this.$location = $location;
                $scope.viewModel = this;
                this.initNavigation();
            }
            NavigationController.prototype.initNavigation = function () {
                var _this = this;
                this.nav = {
                    navItems: ['user', 'group', 'configuration'],
                    selectedIndex: this.$location.path() == '/group' ? 1 : 0,
                    navClick: function ($index) {
                        _this.nav.selectedIndex = $index;
                    }
                };
            };
            return NavigationController;
        }());
        Controller.NavigationController = NavigationController;
    })(Controller = Rockstars.Controller || (Rockstars.Controller = {}));
})(Rockstars || (Rockstars = {}));
/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../model/UserModel.ts" />
/// <reference path="../model/GroupModel.ts" />
/// <reference path="../services/PouchDBService.ts" />
/// <reference path="../helpers/ModelHelper.ts" />
var Rockstars;
(function (Rockstars) {
    var Controller;
    (function (Controller) {
        var model = Rockstars.Model;
        var service = Rockstars.Service;
        var helper = Rockstars.Helper;
        var UserController = (function () {
            function UserController($scope, $location, $window, $rootScope, $http, $q, $filter, $routeParams) {
                this.$scope = $scope;
                this.$location = $location;
                this.$window = $window;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$q = $q;
                this.$filter = $filter;
                this.$routeParams = $routeParams;
                $scope.viewModel = this;
                this.pouchDBService = new service.PouchDBService($q);
                this.modelHelper = new helper.ModelHelper();
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
            UserController.prototype.initPage = function () {
                var _this = this;
                var user_id = this.$routeParams.user_id;
                if (user_id) {
                    if (this.$location.path() === '/user/' + user_id) {
                        this.pouchDBService.getEntityById(Rockstars.Enum.EntityType.User, user_id).then(function (entity) {
                            _this.currentUser = entity;
                        }, function (reason) { });
                    }
                    else if (this.$location.path() === '/user/edit/' + user_id) {
                        this.pouchDBService.getEntityById(Rockstars.Enum.EntityType.User, user_id).then(function (entity) {
                            _this.currentUser = entity;
                        }, function (reason) { });
                    }
                }
                else {
                    if (this.$location.path() === '/user') {
                        this.initUserList();
                    }
                    else if (this.$location.path() === '/user/add') {
                        this.currentUser = new model.UserModel();
                    }
                }
                this.initGroupList();
            };
            UserController.prototype.initUserList = function () {
                var _this = this;
                this.pouchDBService.getAll(Rockstars.Enum.EntityType.User).then(function (data) {
                    _this.userList = data;
                    _this.userList.sort(function (a, b) {
                        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
                    });
                    _this.userListTmp = _this.userList;
                    _this.initPagination();
                }, function (reason) { });
            };
            UserController.prototype.initPagination = function () {
                this.currentPage = 1;
                this.numOfPages = this.userList.length % this.pageSize === 0 ?
                    this.userList.length / this.pageSize : Math.floor(this.userList.length / this.pageSize) + 1;
            };
            UserController.prototype.initGroupList = function () {
                var _this = this;
                this.pouchDBService.getAll(Rockstars.Enum.EntityType.Group).then(function (data) {
                    _this.availableGroups = data;
                    _this.modelHelper = new helper.ModelHelper(null, data);
                }, function (reason) {
                    _this.availableGroups = [];
                });
            };
            UserController.prototype.directToUserForm = function () {
                this.$location.path('/user/add');
            };
            UserController.prototype.addUser = function (userModel) {
                var _this = this;
                userModel.createdDate = new Date().toString();
                this.pouchDBService.addEntity(userModel).then(function (data) {
                    _this.$location.path('/user');
                }, function (reason) { });
            };
            UserController.prototype.removeUser = function () {
                var _this = this;
                var confirmDialog = this.$window.confirm('Do you want to delete the user?');
                if (confirmDialog) {
                    for (var i = 0; i < this.userList.length; i++) {
                        var user = this.userList[i];
                        if (user.isChecked) {
                            this.pouchDBService.deleteEntity(user).then(function (data) {
                                _this.initUserList();
                            }, function (reason) { });
                        }
                    }
                }
            };
            UserController.prototype.getNumberPage = function () {
                if (this.numOfPages > 0) {
                    return new Array(this.numOfPages);
                }
                return new Array(0);
            };
            UserController.prototype.goToPage = function (pageIndex) {
                this.currentPage = pageIndex;
            };
            UserController.prototype.goToPreviousPage = function () {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.goToPage(this.currentPage);
                }
            };
            UserController.prototype.goToNextPage = function () {
                if (this.currentPage < this.numOfPages) {
                    this.currentPage++;
                    this.goToPage(this.currentPage);
                }
            };
            UserController.prototype.getUserListOnPage = function () {
                if (this.userList && this.userList.length > 0) {
                    var startIndex = this.pageSize * (this.currentPage - 1);
                    var endIndex = startIndex + this.pageSize;
                    return this.userList.slice(startIndex, endIndex);
                }
            };
            UserController.prototype.selectAllUsersOnPage = function () {
                var userOnPage = this.getUserListOnPage();
                for (var index = 0; index < userOnPage.length; index++) {
                    var user = userOnPage[index];
                    user.isChecked = this.isCheckedAll;
                }
            };
            UserController.prototype.removeUserInDetail = function (user) {
                var _this = this;
                var confirmDialog = this.$window.confirm('Do you want to delete the user?');
                if (confirmDialog) {
                    this.pouchDBService.deleteEntity(user).then(function (data) {
                        _this.$location.path('/user');
                    }, function (reason) { });
                }
            };
            UserController.prototype.updateUser = function (user) {
                var _this = this;
                this.pouchDBService.updateEntity(user).then(function (data) {
                    _this.$location.path('/user');
                }, function (reason) { });
            };
            return UserController;
        }());
        Controller.UserController = UserController;
    })(Controller = Rockstars.Controller || (Rockstars.Controller = {}));
})(Rockstars || (Rockstars = {}));
