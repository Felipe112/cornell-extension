import App from './App';
import { Note } from './Note';

const mockedElement = {
    innerHTML: '',
    addEventListener: jest.fn(),
    setAttribute: jest.fn(),
};

describe('App', () => {
    let app: App;
    let list: HTMLTableElement;
    let removeIdeas: NodeListOf<HTMLInputElement>;

    beforeEach(() => {
        const mockGetElementById = jest.fn();
        jest.spyOn(document, 'getElementById').mockImplementation(mockGetElementById);
        mockGetElementById.mockReturnValueOnce(mockedElement);
        app = new App();
        app.ideas = [{ id: 1, description: 'idea 1' }, { id: 2, description: 'idea 2' }, { id: 3, description: 'idea 3' }];
        list = document.createElement('table');
        removeIdeas = document.querySelectorAll<HTMLInputElement>('.button-small');
    });

    test('add success', () => {
        const ideaText = 'new idea';
        app.add(ideaText);

        expect(app.ideas).toHaveLength(4);
        expect(app.ideas[3]).toEqual({ id: 4, description: ideaText });
    });

    test('removes an idea with a given id', () => {
        app.remove(2);
        expect(app.ideas).toEqual([{ id: 1, description: 'idea 1' }, { id: 3, description: 'idea 3' }]);
    });

    test('does not remove anything if the id is not found', () => {
        app.remove(4);
        expect(app.ideas).toEqual([{ id: 1, description: 'idea 1' }, { id: 2, description: 'idea 2' }, { id: 3, description: 'idea 3' }]);
    });

    test('should return 0 if the ideas array is empty', () => {
        app.ideas = [];
        expect(app.maxId()).toBe(0);
    });

    test('should return the highest id if the ideas array is not empty', () => {
        expect(app.maxId()).toBe(3);
    });

    test('Should refresh the list correctly', () => {
        const list = document.createElement('table');
        app.refreshList(list);

        const rows = list.getElementsByTagName('tr');
        expect(rows.length).toBe(3);

        const firstRow = rows[0];
        const secondRow = rows[1];
        const threeRow = rows[2];

        expect(firstRow.id).toBe('1');
        expect(firstRow.innerHTML).toContain('idea 1');

        expect(secondRow.id).toBe('2');
        expect(secondRow.innerHTML).toContain('idea 2');

        expect(threeRow.id).toBe('3');
        expect(threeRow.innerHTML).toContain('idea 3');
    });

    test('should remove an idea', () => {
        app.add('new idea');
        app.ideaDelete(list);

        removeIdeas.forEach(ideaDelete => {
            ideaDelete.click();
        });

        expect(app.ideas.length).toBe(4);
    });

    test('should save notes to local storage', () => {
        const notes: Note[] = [
            { id: '1', topic: 'Note 1', ideas: app.ideas, note: 'prueba', summary: 'summarry' },
            { id: '2', topic: 'Note 2', ideas: app.ideas, note: 'prueba', summary: 'summarry' },
        ];
        app.saveNote(notes);

        expect(window.localStorage.getItem('Notes')).toBe(JSON.stringify(notes));
    });



});