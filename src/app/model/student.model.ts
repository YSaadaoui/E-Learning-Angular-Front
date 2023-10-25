import {User} from "./user.model";

export interface Student {
  studentId:number;
  firstName:string;
  lastName:string;
  level:string;
  user:User;
}
