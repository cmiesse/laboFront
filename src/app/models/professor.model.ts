import { Course } from "./course.model";
import { Section } from "./section.model";

export interface Professor{
    id:number,
    name:string,
    surname:string,
    office:number,
    email:string,
    hireDate:Date,
    wage:number,
    section:Section,
    cours:Course[]
}