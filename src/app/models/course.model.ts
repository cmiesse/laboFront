import { Professor } from "./professor.model";

export interface Course{
    id:string,
    name:string,
    ects:number,
    prof:Professor
}