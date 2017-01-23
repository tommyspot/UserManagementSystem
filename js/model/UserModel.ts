
module Rockstars.Model {
    export class UserModel extends BaseModel{
        public id: number;
        public email: string;
        public password: string;
        public userName: string;
        public firstName: string;
        public lastName: string;
        public dateOfBirth: string;
        public groupId: number;
        public role: number;

        constructor() {
            super();
            this.type = 'user';
        }
    }
}