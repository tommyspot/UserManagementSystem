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

			this.pouchDB = new Rockstars.Service.PouchDBService($q);
			this.$cookies = $cookies;
		}

		doCallback(callback: Function, data?: any, status?: any) {
			if (callback) {
				callback(data, status);
			}
		}

		login(userLogin: Model.UserLoginModel, successCallback: Function, errorCallback: Function) {
			this.pouchDB.getAll(Enum.EntityType.User).then(
				(results: Array<Model.UserModel>) => {

					if (userLogin.identifier === 'admin' && userLogin.password === 'admin') {
						//this.$cookies.putObject('user', userLogin);
						return this.doCallback(successCallback, userLogin);

					} else {
						for (let index = 0; index < results.length; index++) {
							let user = results[index];
							if (user.password === userLogin.password && (user.userName === userLogin.identifier || user.email === userLogin.identifier)) {
								if(userLogin.isRememberMe){
									this.$cookies.putObject('user', user);
								} else {
									var ms = new Date().getTime();
									var expireDate = new Date(ms + 86400000);//1 day
									
									var option={'expires': expireDate};
									this.$cookies.putObject('user', user, option);
								}
								
								return this.doCallback(successCallback, user);
							}
						}

						return this.doCallback(errorCallback, 'Invalid user name or password');
					}
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

	}
}