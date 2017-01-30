
module Rockstars.Model {
    export class GroupModel extends BaseModel{
        public name: string;
        public notes: string;

        constructor() {
            super();
            this.type = Enum.EntityType.Group;
        }
    }
}