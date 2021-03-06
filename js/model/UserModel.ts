/// <reference path="../model/BaseModel.ts" />
/// <reference path="../model/Enum.ts" />

module Rockstars.Model {
    export class UserModel extends BaseModel{
        public firstName: string;
        public lastName: string;
        public email: string;
        public userName: string;
        public password: string;
        public dateOfBirth: string;
        public groupId: string;
        public role: number;
        public notes: string;

        constructor() {
            super();
            this.type =  Enum.EntityType.User;
        }
    }

    export class UserLoginModel{
        public identifier: string;
        public password: string;
        public isRememberMe: boolean;
    }

}