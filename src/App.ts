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
let ideas: Idea[] = [];
let notes: Note[] = [];
let idNote: string | null = null;

const add = (ideaText: string) => {
    ideas.push({ id: maxId() + 1, description: ideaText });
};

const remove = (id: number) => {
    let index = ideas.findIndex(i => i.id === id);
    if (index !== -1) {
        ideas.splice(index, 1);
    }
};

const maxId = (): number => {
    return ideas.length <= 0 ? 0 : Math.max(...ideas.map(idea => idea.id));
};

const refreshList = (list: HTMLTableElement | null) => {
    if (list) {
        for (let i = list.rows.length - 1; i > 0; i--) {
            list.deleteRow(i);
        }
        ideas.forEach((idea): void => {
            let newItem = document.createElement("tr") as HTMLTableRowElement;
            newItem.id = idea.id.toString();
            newItem.innerHTML = `
            <td id="idea${idea.id}" >${idea.description} </td>
            <td><input type="button" class="button button-small btn-delete" data-id="${idea.id}" value="X"/></td> `;
            list.appendChild(newItem);
            ideaDelete(list);
        });
    }
};

const ideaDelete = (list: HTMLTableElement | null) => {
    const removeIdeas = document.querySelectorAll<HTMLInputElement>(".button-small");
    removeIdeas.forEach(ideaDelete => ideaDelete.addEventListener("click", (e) => {
        remove((Number(ideaDelete.getAttribute("data-id"))));
        refreshList(list);
    }));
}

//Función para guardar en localstores
const saveNote = (notes: Note[]) => {
    if (typeof (Storage) !== "undefined") {
        window.localStorage.setItem('Notes', JSON.stringify(notes));
    }
}

const allNotes = (): Note[] => {
    const noteStore = window.localStorage.getItem('Notes');
    if (noteStore !== null) {
        return JSON.parse(noteStore) as Note[];
    }
    return notes;
}

const visible = (set: HTMLElement) => {
    set.style.display = 'block';
}
const invisible = (set: HTMLElement) => {
    set.style.display = 'none';
}

const refreshListNote = () => {
    if (lsNote) {
        for (let i = lsNote.rows.length - 1; i > 0; i--) {
            lsNote.deleteRow(i);
        }
        allNotes().forEach((note): void => {
            let newItem = document.createElement("tr") as HTMLTableRowElement;
            newItem.id = note.id.toString();
            newItem.innerHTML = `
            <td>${note.topic} </td>
            <td>${note.ideas.map(i => i.description)} </td>
            <td><input type="button" class="button button-small btn-edit" data-id="${note.id}" value="Edit"/>
            &nbsp;&nbsp;<input type="button" class="button button-small btn-delete btn-delete-note" data-id="${note.id}" value="X"/></td> `;
            lsNote.appendChild(newItem);
            noteDelete();
            noteEdit();
        });
    }
};

const noteDelete = () => {
    const removeIdeas = document.querySelectorAll<HTMLInputElement>(".btn-delete-note");
    removeIdeas.forEach(noteDelete => noteDelete.addEventListener("click", (e) => {
        removeNote(noteDelete.getAttribute("data-id"));
        refreshListNote();
    }));
}
const removeNote = (id: string | null) => {
    if (id) {
        let index = allNotes().findIndex(i => i.id === id);
        if (index !== -1) {
            let notesAll = allNotes();
            notesAll.splice(index, 1);
            saveNote(notesAll);
        }
    }
};

const noteEdit = () => {
    const editIdeas = document.querySelectorAll<HTMLInputElement>(".btn-edit");
    editIdeas.forEach(noteEdit => noteEdit.addEventListener("click", (e) => {
        updateNote(noteEdit.getAttribute("data-id"));
    }));
}

const updateNote = (id: string | null) => {
    if (id) {
        let getNote = allNotes().find(i => i.id === id);
        if (getNote) {
            idNote = getNote.id;
            txtTopic.value = getNote.topic;
            ideas = getNote.ideas;
            txtNote.value = getNote.note;
            txtSummary.value = getNote.summary;
            refreshList(lsIdea);
            visible(setForm);
            invisible(setList);
        }
    }
};


const init = () => {
    visible(setForm);
    invisible(setList);
    if (btnIdea) {
        btnIdea.onclick = (e) => {
            add(txtIdea ? txtIdea.value : '');
            refreshList(lsIdea);
            txtIdea ? txtIdea.value = "" : null;
        }
    }
    if (btnSave) {
        btnSave.onclick = (e) => {
            let note = new Note(idNote ? idNote : uuid4(), txtTopic.value, ideas, txtNote.value, txtSummary.value);
            if (notes.length <= 0) {
                notes = allNotes();
            }
            if (idNote) {
                let index = allNotes().findIndex(i => i.id === idNote);
                notes[index] = note;
            } else {
                notes.push(note);
            }
            saveNote(notes);
            invisible(setForm);
            visible(setList);
            refreshListNote();
        }
    }
    if (btnNew) {
        btnNew.onclick = (e) => {
            visible(setForm);
            invisible(setList);
        }
    }
    if (btnList) {
        btnList.onclick = (e) => {
            refreshListNote();
            invisible(setForm);
            visible(setList);
        }
    }
};

document.addEventListener("DOMContentLoaded", init);


