/// <reference path="../lib/angularjs/angular.d.ts" />
/// <reference path="../lib/pouchdb/index.d.ts" />
/// <reference path="../lib/pouchdb/pouch.d.ts" />

module Rockstars.Service {

	export class PouchDBService {

		public $q: ng.IQService;
		public database: any;

		constructor($q: ng.IQService) {
			this.$q = $q;
			this.database = new PouchDB('UserDB');
		}

		getAll(type: string) {
			var defer = this.$q.defer();
			this.database.allDocs({ include_docs: true, descending: true }, function (err: any, doc: any) {
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