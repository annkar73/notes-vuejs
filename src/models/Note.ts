export class Note {
    id: number;
    title: string;
    content: string;
    done: boolean;

    constructor(title: string, content: string) {
        this.id = Date.now();
        this.title = title;
        this.content = content;
        this.done = false;
    }
}