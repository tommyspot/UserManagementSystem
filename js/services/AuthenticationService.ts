/// <reference path="../model/BaseModel.ts" />
/// <reference path="../model/UserModel.ts" />
/// <reference path="../model/GroupModel.ts" />
/// <reference path="../services/PouchDBService.ts" />

module Rockstars.Service {

	export class AuthenticationService {
		public pouchDB: Rockstars.Service.PouchDBService;

		constructor(private $q: ng.IQService,
			private $location: ng.ILocationService,
			private $cookies: ng.ICookiesService) {

			this.pouchDB = new Rockstars.Service.PouchDBService($q, $cookies);
		}

		doCallback(callback: Function, data?: any, status?: any) {
			if (callback) {
				callback(data, status);
			}
		}

		login(userLogin: Model.UserLoginModel, successCallback: Function, errorCallback: Function) {
			this.pouchDB.getAll(Enum.EntityType.User).then(
				(results: Array<Model.UserModel>) => {
					for (let index = 0; index < results.length; index++) {
						let user = results[index];
						if (user.password === userLogin.password 
							&& (user.userName.toLowerCase() === userLogin.identifier.toLowerCase() || user.email.toLowerCase() === userLogin.identifier.toLowerCase())) {
							
							if (userLogin.isRememberMe) {
								this.$cookies.putObject('user', user);
							} else {
								var today = new Date().getTime();
								var oneDay = 86400000;	//miliseconds
								var expireDate = new Date(today + oneDay);

								var option = { 'expires': expireDate };
								this.$cookies.put('expireTime', oneDay.toString());
								this.$cookies.putObject('user', user, option);
							}

							return this.doCallback(successCallback, user);
						}
					}

					return this.doCallback(errorCallback, 'Invalid user name or password');
				},
				(reason) => {
					return this.doCallback(errorCallback, reason);
				});
		}

		logOut() {
			let user = this.$cookies.getObject('user');
			if (user) {
				this.$cookies.remove('user');
			}
			let expireTime = this.$cookies.get('expireTime');
			if (expireTime) {
				this.$cookies.remove('expireTime');
			}
			this.$location.path('/login');
		}

		isAuthenticated() {
			if (this.$cookies.getObject('user')) {
				return true;
			}
			return false;
		}

		hasEditorPermission() {
			var userLogin = this.$cookies.getObject('user');

			if (userLogin && userLogin.role === Enum.UserRole.Admin) {
				return true;
			}
			if (userLogin && userLogin.role === Enum.UserRole.Editor) {
				return true;
			}
			return false;
		}

		hasAdminPermission() {
			var userLogin = this.$cookies.getObject('user');

			if (userLogin && userLogin.role === Enum.UserRole.Admin) {
				return true;
			}
			return false;
		}

		initTempAdminUser(){
			var userName = 'admin';
			this.pouchDB.getUserByName(userName).then(
				(result: Model.UserModel) => {
					if (result == null) {
						var user = new Model.UserModel();
						user.createdDate = new Date().toString();
						user.email = 'admin@gmail.com';
						user.userName = 'admin';
						user.password = 'admin';
						user.firstName = 'admin';
						user.role = Enum.UserRole.Admin;
						this.pouchDB.addEntity(user).then((result) => {},(reason) => {});
					}
				}, (reason) => {});
		}
	}
}