import { Student } from "./student.model";

export interface Section{
    id:number,
    name:string,
    delegateId:number,
    students:Student[]
}