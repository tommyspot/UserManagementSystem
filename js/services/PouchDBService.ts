/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/angularjs/angular-cookies.d.ts" />
/// <reference path="../lib/pouchdb/index.d.ts" />
/// <reference path="../lib/pouchdb/pouch.d.ts" />
/// <reference path="../model/BaseModel.ts" />
/// <reference path="../model/UserModel.ts" />
/// <reference path="../model/GroupModel.ts" />

module Rockstars.Service {

	export class PouchDBService {
		public database: any;

		constructor(private $q: ng.IQService,
			private $cookies: ng.ICookiesService) {

			this.initDatabase();
		}

		initDatabase(){
			var dbName = this.$cookies.get('dbURL');
			if(dbName == null){
				dbName = 'UserDB';
				this.$cookies.put('dbURL', dbName);
			}
			this.database = new PouchDB(dbName);
		}

		getAll(type: number) {
			var defer = this.$q.defer();
			this.database.allDocs({ include_docs: true, descending: true }, function (err: any, doc: any) {
				var entityList = [];
				if(doc){
					for (var docRow = 0; docRow < doc.rows.length; docRow++) {
						var entityDoc = doc.rows[docRow].doc;
						if (entityDoc.type === type) {
							entityList.push(entityDoc);
						}
					}
				}
				defer.resolve(entityList);
			});
			return defer.promise;
		};

		getEntityById(type: number, _id: string) {
			var defer = this.$q.defer();

			this.getAll(type).then((result: Array<Model.BaseModel>) => {
				for (let index = 0; index < result.length; index++) {
					let entity = result[index];
					if (entity._id === _id) {
						defer.resolve(entity);
					}
				}
			}, (reason) => {
				defer.reject(reason);
			});
			return defer.promise;
		};

		getUserByName(userName: string) {
			var defer = this.$q.defer();

			this.getAll(Enum.EntityType.User).then((result: Array<Model.UserModel>) => {
				if(result && result.length == 0){
					defer.resolve(undefined);
				}
				else {
					let isUserExisted = false;
					for (let index = 0; index < result.length; index++) {
						let user = result[index];
						if (user.userName === userName) {
							isUserExisted = true;
							defer.resolve(user);
							break;
						}
					}
					if(!isUserExisted){
						defer.resolve(undefined);
					}
				}

			}, (reason) => {
				defer.reject(reason);
			});
			return defer.promise;
		};

		updateEntity(entityInfo: Model.BaseModel) {
			var defer = this.$q.defer();

			this.database.get(entityInfo._id).then((doc:any)  => {
				
				if (entityInfo.type === Enum.EntityType.User) {
					let entity = <Model.UserModel>entityInfo;
					return this.database.put({
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

				} else if (entityInfo.type === Enum.EntityType.Group) {
					let entity = <Model.GroupModel>entityInfo;
					return this.database.put({
						_id: entity._id,
						_rev: entity._rev,
						type: entity.type,
						createdDate: entity.createdDate,
						name: entity.name,
						notes: entity.notes
					});
				}

			}).then(function (result: any) {
				// handle response
				defer.resolve(result);
			}).catch(function (reason: any) {
				//console.log(reason);
				defer.reject(reason);
			});

			return defer.promise;
		};

		deleteEntity(entity: Rockstars.Model.BaseModel) {
			var defer = this.$q.defer();

			this.database.get(entity._id).then((doc: any) => {
				return this.database.remove(doc._id, doc._rev);
			}).then((result: any) => {
				// handle result
				defer.resolve(result);
			}).catch((reason: any) => {
				//console.log(reason);
				defer.reject(reason);
			});

			return defer.promise;
		};

		addEntity(entity: Rockstars.Model.BaseModel) {
			var defer = this.$q.defer();

			this.database.post(entity).then(function (result: any) {
				// handle response
				defer.resolve(result);
			}).catch(function (reason: any) {
				//console.log(reason);
				defer.reject(reason);
			});

			return defer.promise;
		};

		//realtime service
		autoLoadingOnChanged(callback: Function) {
			this.database.changes({
				since: 'now',
				live: true
			}).on('change', callback);
		}

	}
}