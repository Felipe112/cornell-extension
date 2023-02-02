import { Idea } from "./Idea";
import { Note } from "./Note";
import { v4 as uuid4 } from 'uuid';

let setForm: HTMLElement = document.getElementById('sect-form') as HTMLElement;
let setList: HTMLElement = document.getElementById('sect-list') as HTMLElement;
let txtIdea: HTMLInputElement = document.getElementById('txtIdea') as HTMLInputElement;
let btnIdea: HTMLButtonElement = document.getElementById('btnIdea') as HTMLButtonElement;
let btnNew: HTMLButtonElement = document.getElementById('btnNew') as HTMLButtonElement;
let btnList: HTMLButtonElement = document.getElementById('btnList') as HTMLButtonElement;
let lsIdea: HTMLTableElement = document.getElementById('ListIdeas') as HTMLTableElement;
let txtTopic: HTMLInputElement = document.getElementById('topic') as HTMLInputElement;
let txtNote: HTMLTextAreaElement = document.getElementById('notes') as HTMLTextAreaElement;
let txtSummary: HTMLTextAreaElement = document.getElementById('summary') as HTMLTextAreaElement;
let btnSave: HTMLButtonElement = document.getElementById('btnSave') as HTMLButtonElement;
let lsNote: HTMLTableElement = document.getElementById('ListNotes') as HTMLTableElement;
let notes: Note[] = [];
let idNote: string | null = null;

export default class App {
    public ideas: Idea[] = [];
    add(ideaText: string) {
        this.ideas.push({ id: this.maxId() + 1, description: ideaText });
    }

    remove(id: number) {
        let index = this.ideas.findIndex(i => i.id === id);
        if (index !== -1) {
            this.ideas.splice(index, 1);
        }
    }

    maxId(): number {
        return this.ideas.length <= 0 ? 0 : Math.max(...this.ideas.map(idea => idea.id));
    }

    refreshList(list: HTMLTableElement | null) {
        if (list) {
            for (let i = list.rows.length - 1; i > 0; i--) {
                list.deleteRow(i);
            }
            this.ideas.forEach((idea): void => {
                let newItem = document.createElement("tr") as HTMLTableRowElement;
                newItem.id = idea.id.toString();
                newItem.innerHTML = `
            <td id="idea${idea.id}" >${idea.description} </td>
            <td><input type="button" class="button button-small btn-delete" data-id="${idea.id}" value="X"/></td> `;
                list.appendChild(newItem);
                this.ideaDelete(list);
            });
        }
    }

    ideaDelete(list: HTMLTableElement | null) {
        const removeIdeas = document.querySelectorAll<HTMLInputElement>(".button-small");
        removeIdeas.forEach(ideaDelete => ideaDelete.addEventListener("click", (e) => {
            this.remove((Number(ideaDelete.getAttribute("data-id"))));
            this.refreshList(list);
        }));
    }

    //Función para guardar en localstores
    saveNote(notes: Note[]) {
        if (typeof (Storage) !== "undefined") {
            window.localStorage.setItem('Notes', JSON.stringify(notes));
        }
    }

    allNotes(): Note[] {
        const noteStore = window.localStorage.getItem('Notes');
        if (noteStore !== null) {
            return JSON.parse(noteStore) as Note[];
        }
        return notes;
    }

    visible(set: HTMLElement) {
        set.style.display = 'block';
    }
    invisible = (set: HTMLElement) => {
        set.style.display = 'none';
    }

    refreshListNote() {
        if (lsNote) {
            for (let i = lsNote.rows.length - 1; i > 0; i--) {
                lsNote.deleteRow(i);
            }
            this.allNotes().forEach((note): void => {
                let newItem = document.createElement("tr") as HTMLTableRowElement;
                newItem.id = note.id.toString();
                newItem.innerHTML = `
            <td>${note.topic} </td>
            <td>${note.ideas.map(i => i.description)} </td>
            <td><input type="button" class="button button-small btn-edit" data-id="${note.id}" value="Edit"/>
            &nbsp;&nbsp;<input type="button" class="button button-small btn-delete btn-delete-note" data-id="${note.id}" value="X"/></td> `;
                lsNote.appendChild(newItem);
                this.noteDelete();
                this.noteEdit();
            });
        }
    };

    noteDelete() {
        const removeIdeas = document.querySelectorAll<HTMLInputElement>(".btn-delete-note");
        removeIdeas.forEach(noteDelete => noteDelete.addEventListener("click", (e) => {
            this.removeNote(noteDelete.getAttribute("data-id"));
            this.refreshListNote();
        }));
    }
    removeNote(id: string | null) {
        if (id) {
            let index = this.allNotes().findIndex(i => i.id === id);
            if (index !== -1) {
                let notesAll = this.allNotes();
                notesAll.splice(index, 1);
                this.saveNote(notesAll);
            }
        }
    };

    noteEdit() {
        const editIdeas = document.querySelectorAll<HTMLInputElement>(".btn-edit");
        editIdeas.forEach(noteEdit => noteEdit.addEventListener("click", (e) => {
            this.updateNote(noteEdit.getAttribute("data-id"));
        }));
    }

    updateNote(id: string | null) {
        if (id) {
            let getNote = this.allNotes().find(i => i.id === id);
            if (getNote) {
                idNote = getNote.id;
                txtTopic.value = getNote.topic;
                this.ideas = getNote.ideas;
                txtNote.value = getNote.note;
                txtSummary.value = getNote.summary;
                this.refreshList(lsIdea);
                this.visible(setForm);
                this.invisible(setList);
            }
        }
    };
}



const init = (e: Event) => {
    let app = new App();
    app.visible(setForm);
    app.invisible(setList);
    if (btnIdea) {
        btnIdea.onclick = (e) => {
            app.add(txtIdea ? txtIdea.value : '');
            app.refreshList(lsIdea);
            txtIdea ? txtIdea.value = "" : null;
        }
    }
    if (btnSave) {
        btnSave.onclick = (e) => {
            let note = new Note(idNote ? idNote : uuid4(), txtTopic.value, app.ideas, txtNote.value, txtSummary.value);
            if (notes.length <= 0) {
                notes = app.allNotes();
            }
            if (idNote) {
                let index = app.allNotes().findIndex(i => i.id === idNote);
                notes[index] = note;
            } else {
                notes.push(note);
            }
            app.saveNote(notes);
            app.invisible(setForm);
            app.visible(setList);
            app.refreshListNote();
        }
    }
    if (btnNew) {
        btnNew.onclick = (e) => {
            app.visible(setForm);
            app.invisible(setList);
        }
    }
    if (btnList) {
        btnList.onclick = (e) => {
            app.refreshListNote();
            app.invisible(setForm);
            app.visible(setList);
        }
    }
};

document.addEventListener("DOMContentLoaded", init);


