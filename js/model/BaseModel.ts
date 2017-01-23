
module Rockstars.Model {
  
  export class BaseModel {
    public _id: string;
    public _rev: string;
    public type: string;
    public isChecked: boolean;
    public createdDate: Date;
  }  
}