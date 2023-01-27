import { Idea } from "./Idea";

export class Note {
    id: string;
    topic: string;
    ideas: Idea[];
    note: string;
    summary: string;

    constructor(id: string, topic: string, ideas: Idea[], note: string, summary: string) {
        this.id = id;
        this.topic = topic;
        this.ideas = ideas;
        this.note = note;
        this.summary = summary;
    }


}