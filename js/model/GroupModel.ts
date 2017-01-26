
module Rockstars.Model {
    export class GroupModel extends BaseModel{
        public name: string;

        constructor() {
            super();
            this.type = Enum.EntityType.Group;
        }
    }
}