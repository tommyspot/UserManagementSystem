var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                    navItems: ['user', 'group'],
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
var Rockstars;
(function (Rockstars) {
    var Controller;
    (function (Controller) {
        //import service = Clarity.Service;
        var UserController = (function () {
            function UserController($scope, $location, $window, $rootScope, $http, $q, $filter) {
                this.$scope = $scope;
                this.$location = $location;
                this.$window = $window;
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$q = $q;
                this.$filter = $filter;
                $scope.viewModel = this;
                this.pouchDBService = new Rockstars.Service.PouchDBService($q);
                this.pageSize = 5;
                this.initPage();
                var self = this;
                $scope.$watch('searchText', function (value) {
                    if (self.userListTmp && self.userListTmp.length > 0) {
                        //self.userList = $filter('filter')(self.userListTmp, {userName: value});
                        self.userList = $filter('filter')(self.userListTmp, value);
                        self.initPaging();
                    }
                });
            }
            UserController.prototype.initPage = function () {
                if (this.$location.path() === '/user') {
                    this.initUserList();
                }
                else if (this.$location.path() === '/user/add') {
                    this.currentUser = new Rockstars.Model.UserModel();
                    this.availableGroups = [
                        { id: 1, name: 'Group A' },
                        { id: 2, name: 'Group B' },
                        { id: 3, name: 'Group C' }
                    ];
                }
            };
            UserController.prototype.initUserList = function () {
                var _this = this;
                this.pouchDBService.getAll('user').then(function (data) {
                    _this.userList = data;
                    _this.userList.sort(function (a, b) {
                        return b.createdDate - a.createdDate;
                    });
                    _this.userListTmp = _this.userList;
                    _this.initPaging();
                }, function (reason) { });
            };
            UserController.prototype.initPaging = function () {
                this.currentPage = 1;
                this.numOfPages = this.userList.length % this.pageSize === 0 ?
                    this.userList.length / this.pageSize : Math.floor(this.userList.length / this.pageSize) + 1;
            };
            UserController.prototype.directToUserForm = function () {
                this.$location.path('/user/add');
            };
            UserController.prototype.addUser = function (userModel) {
                var _this = this;
                userModel.createdDate = new Date();
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
            UserController.prototype.getUserRole = function (role) {
                return role === 0 ? 'Admin' : (role === 1 ? 'Editor' : 'View');
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
            return UserController;
        }());
        Controller.UserController = UserController;
    })(Controller = Rockstars.Controller || (Rockstars.Controller = {}));
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
            // update(contactInfo) {		
            // 	var defer = this.$q.defer();
            // 	this.database.get(contactInfo._id).then(function(doc) {
            // 	  return this.database.put({
            // 		_id: contactInfo._id,
            // 		_rev: contactInfo._rev,
            // 		firstName: contactInfo.firstName,
            // 		lastName: contactInfo.lastName,
            // 		email: contactInfo.email,
            // 		phone: contactInfo.phone,
            // 		url: contactInfo.url,
            // 		notes: contactInfo.notes
            // 	  });
            // 	}).then(function(result) {
            // 	  // handle response
            // 	  defer.resolve(result);
            // 	}).catch(function (reason) {
            // 	  //console.log(reason);
            // 	  defer.reject(reason);
            // 	});
            // 	return defer.promise;
            // };
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
// export enum UserRole{
//     Admin,
//     Editor,
//     View
// } 
var Rockstars;
(function (Rockstars) {
    var Model;
    (function (Model) {
        var GroupModel = (function (_super) {
            __extends(GroupModel, _super);
            function GroupModel() {
                var _this = _super.call(this) || this;
                _this.type = 'group';
                return _this;
            }
            return GroupModel;
        }(Model.BaseModel));
        Model.GroupModel = GroupModel;
    })(Model = Rockstars.Model || (Rockstars.Model = {}));
})(Rockstars || (Rockstars = {}));
var Rockstars;
(function (Rockstars) {
    var Model;
    (function (Model) {
        var UserModel = (function (_super) {
            __extends(UserModel, _super);
            function UserModel() {
                var _this = _super.call(this) || this;
                _this.type = 'user';
                return _this;
            }
            return UserModel;
        }(Model.BaseModel));
        Model.UserModel = UserModel;
    })(Model = Rockstars.Model || (Rockstars.Model = {}));
})(Rockstars || (Rockstars = {}));
