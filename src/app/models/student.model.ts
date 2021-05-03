import { Section } from "./section.model";

export interface Student{
    id:number,
    firstname:string,
    lastname:string,
    birthdate:Date,
    login:string,
    section:Section,
    result:number,
    courseId:number
}