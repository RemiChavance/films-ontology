import { Film } from "./film.model";

export class Concept {
    name!: string;
    level!: number;
    films!: string[];
    subs!: Concept[]
}
