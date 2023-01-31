import { Idea } from "./Idea";
import { Note } from "./Note";
import { v4 as uuid4 } from 'uuid';

let txtIdea: HTMLInputElement = document.getElementById('txtIdea') as HTMLInputElement;
let btnIdea: HTMLButtonElement = document.getElementById('btnIdea') as HTMLButtonElement;
let lsIdea: HTMLTableElement = document.getElementById('ListIdeas') as HTMLTableElement;
let deleteBans = document.getElementsByClassName("btn-delete");
let txtTopic: HTMLInputElement = document.getElementById('topic') as HTMLInputElement;
let txtNote: HTMLTextAreaElement = document.getElementById('notes') as HTMLTextAreaElement;
let txtSummary: HTMLTextAreaElement = document.getElementById('summary') as HTMLTextAreaElement;
let btnSave: HTMLButtonElement = document.getElementById('btnSave') as HTMLButtonElement;
let ideas: Idea[] = [];
let notes: Note[] = [];

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
            <td><input type="button" class="button button-small" data-id="${idea.id}" class="delete-button" value="X"/></td> `;
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



const init = () => {
    if (btnIdea) {
        btnIdea.onclick = (e) => {
            add(txtIdea ? txtIdea.value : '');
            refreshList(lsIdea);
            txtIdea ? txtIdea.value = "" : null;
            deleteBans = document.getElementsByClassName("btn-delete");
        }
    }
    if (btnSave) {
        btnSave.onclick = (e) => {
            let note = new Note(uuid4(), txtTopic.value, ideas, txtNote.value, txtSummary.value);
            if (notes.length <= 0) {
                notes = allNotes();
            }
            notes.push(note);
            saveNote(notes);
            console.log(allNotes());
        }
    }
};

document.addEventListener("DOMContentLoaded", init);


