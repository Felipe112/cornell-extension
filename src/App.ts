import { Idea } from "./Idea";

let txtIdea: HTMLInputElement = document.getElementById('txtIdea') as HTMLInputElement;
let btnIdea: HTMLButtonElement = document.getElementById('btnIdea') as HTMLButtonElement;
let lsIdea: HTMLUListElement = document.getElementById('ListIdeas') as HTMLUListElement;
let deleteBans = document.getElementsByClassName("btn-delete");
let ideas: Idea[] = [];

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


const refreshList = (list: HTMLUListElement | null) => {
    if (list) {
        list.innerHTML = "";
        ideas.forEach((idea): void => {
            let newItem = document.createElement("li") as HTMLLIElement;
            newItem.id = idea.id.toString();
            newItem.value = idea.id;
            newItem.innerHTML = `<div class="input-container">
        <label id="idea${idea.id}" class="custom-label" for="idea" >${idea.description} </label>
        <input type="button" class="btn-delete" data-id="${idea.id}" class="delete-button" value="X"/>
      </div>`;
            list.appendChild(newItem);
            ideaDelete(list);
        });
    }
};

const ideaDelete = (list: HTMLUListElement | null) => {
    const removeIdeas = document.querySelectorAll<HTMLInputElement>(".btn-delete");
    removeIdeas.forEach(ideaDelete => ideaDelete.addEventListener("click", (e) => {
        remove((Number(ideaDelete.getAttribute("data-id"))));
        refreshList(list);
    }));
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
};

document.addEventListener("DOMContentLoaded", init);


