/// <reference path="../services/PouchDBService.ts" />

module Rockstars.Helper {
    import model = Rockstars.Model;
    import service = Rockstars.Service;

    export class ModelHelper {
        public pouchDBService: service.PouchDBService;
        public userList: Array<model.UserModel>;

        // constructor(userList: Array<model.UserModel>) {
        //     this.userList = userList;
        // }

        // getUserById(_id: string) {
        //     for (let i = 0; i < this.userList.length; i++) {
        //         var user = this.userList[i];
        //         if (user._id === _id) {
        //             return this.userList[i];
        //         }
        //     }
        //     return null;
        // }

        getUserRole(role: number){
            return role === Enum.UserRole.Admin ? 'Admin' : 
                        (role === Enum.UserRole.Editor ? 'Editor' : 'View');
        }

        formatCreatedDate(date: string){
            let dateObject = new Date(date);
            return dateObject.toDateString() + ' ' + dateObject.toLocaleTimeString();
        }

        formatShortCreatedDate(date: string){
            let dateObject = new Date(date);
            return dateObject.toDateString();
        }

    }
}