/// <reference path="../model/Enum.ts" />

module Rockstars.Helper {

    export class ModelHelper {
        public userList: Array<Model.UserModel>;
        public groupList: Array<Model.GroupModel>;

        constructor(userList?: Array<Model.UserModel>, groupList?: Array<Model.GroupModel>){
            this.userList = userList;
            this.groupList = groupList;
        }

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

        getGroupName(_id: string) {
            if (this.groupList && this.groupList.length > 0) {
                for (let index = 0; index < this.groupList.length; index++) {
                    let group = this.groupList[index];
                    if (group._id === _id) {
                        return group.name;
                    }
                }
            }
            return '';
        }
    }
}