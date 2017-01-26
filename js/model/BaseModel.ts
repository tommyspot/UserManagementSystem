
module Rockstars.Model {
  
  export class BaseModel {
    public _id: string;
    public _rev: string;
    public type: number;
    public isChecked: boolean;
    public createdDate: string;
  }  
}