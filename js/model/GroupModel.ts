
module Rockstars.Model {
    export class GroupModel extends BaseModel{
        public id: number;
        public name: string;

        constructor() {
            super();
            this.type = 'group';
        }
    }
}