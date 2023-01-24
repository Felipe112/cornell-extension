import { Idea } from "./Idea";

let txtIdea: HTMLInputElement = document.getElementById('txtIdea') as HTMLInputElement;
let btnIdea: HTMLButtonElement = document.getElementById('btnIdea') as HTMLButtonElement;
let lsIdea: HTMLUListElement = document.getElementById('ListIdeas') as HTMLUListElement;
let ideas: Idea[] = [];

const add = (ideaText: string) => {
    ideas.push({ id: maxId() + 1, description: ideaText });
};

const update = (idea: Idea) => {
    let index = ideas.findIndex(i => i.id === idea.id);
    if (index !== -1) {
        ideas[index] = idea;
    }
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

const refreshList = (list: HTMLUListElement | null) => {
    if (list) {
        list.innerHTML = "";
        ideas.forEach((idea): void => {
            let newItem = document.createElement("li") as HTMLLIElement;
            newItem.id = idea.id.toString();
            newItem.value = idea.id;
            newItem.innerHTML = `<div class="input-container">
        <input type="text" id="idea${idea.id}"  value="${idea.description}" readonly>
        <button class="delete-button">X</button>
      </div>`;
            list.appendChild(newItem);
        });
    }
};

const init = () => {
    if (btnIdea) {
        btnIdea.onclick = (e) => {
            e.preventDefault();
            add(txtIdea ? txtIdea.value : '');
            refreshList(lsIdea);
            txtIdea ? txtIdea.value = "" : null;
        }
    }
};

document.addEventListener("DOMContentLoaded", init);


