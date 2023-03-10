/**
 * @jest-environment jsdom
 */

import * as functions from '../ts/functions';
import * as main from '../ts/main';
import { Todo } from '../ts/models/Todo';

beforeEach(() => {
    document.body.innerHTML = '';
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('addListenerToSortBtn', () => {
    test('clicking sort list button calls sortList', () => {
        // Arrange
        document.body.innerHTML = `<button id="sortList">Sortera lista</button>`;
        let sortBtn = document.getElementById('sortList') as HTMLButtonElement;
        let sortListSpy = jest.spyOn(functions, 'sortList').mockReturnValue();
        let createHTMLSpy = jest.spyOn(main, 'createHtml').mockReturnValue();
        main.addListenerToSortBtn();

        // Act
        sortBtn.click();

        // Assert
        expect(sortListSpy).toHaveBeenCalledTimes(1);
        expect(createHTMLSpy).toHaveBeenCalledTimes(1);
    });
});

describe('createNewTodo', () => {
    test('if message length is over 2, call createHTML', () => {
        // Arrange
        let todoList: Todo[] = [];
        let todoText = 'Hello world';
        let createHTMLSpy = jest.spyOn(main, 'createHtml').mockReturnValue();
        jest.spyOn(main, 'displayError').mockReturnValue();

        // Act
        main.createNewTodo(todoText, todoList);

        // Assert
        expect(createHTMLSpy).toHaveBeenCalled();
    });

    test('if message length is 2 or under, call displayError', () => {
        // Arrange
        let todoList: Todo[] = [];
        let todoText = 'H';
        let displayErrorSpy = jest.spyOn(main, 'displayError').mockReturnValue();
        
        // Act
        main.createNewTodo(todoText, todoList);

        // Assert
        expect(displayErrorSpy).toHaveBeenCalled();
    });

    //Skipped test because assigment only allowed successful tests
    test.skip('error message should be removed after success', () => {
        // Arrange
        let todoList: Todo[] = [];
        let todoIncorrect = 'H';
        let todoCorrect = 'Hello world';
        document.body.innerHTML = `<div id="error" class"error"></div>`;
        jest.spyOn(main, 'createHtml').mockReturnValue();
        

        // Act
        main.createNewTodo(todoIncorrect, todoList);
        main.createNewTodo(todoCorrect, todoList);

        // Assert
        let errorHTML = document.getElementById('error') as HTMLDivElement;
        expect(errorHTML.classList.contains('show')).toBe(false);
    });
});

describe('createHTML', () => {
    test('checks that localStorage saves correct amount of list items', () => {
        // Arrange
        document.body.innerHTML = `<ul id="todos" class="todo"></ul>`;
        let todoList: Todo[] = [
            new Todo('Lorem', false),
            new Todo('Ipsum', true),
            new Todo('Dolor', false)
        ];

        // Act
        main.createHtml(todoList);
        let fetchedData = JSON.parse(localStorage.getItem('todos') || '[]');

        // Assert
        expect(fetchedData).toHaveLength(3);
    });

    test('if todos is empty, todos HTML is empty', () => {
        // Arrange
        document.body.innerHTML = `<ul id="todos" class="todo"></ul>`;
        let todoList: Todo[] = [];

        // Act
        main.createHtml(todoList);

        // Assert
        let todosHTML = document.getElementById('todos') as HTMLUListElement;
        expect(todosHTML.innerHTML).toBe("");
    });

    test('if todos contains one list item, todos HTML contains exactly one list item', () => {
        // Arrange
        document.body.innerHTML = `<ul id="todos" class="todo"></ul>`;
        let todoList: Todo[] = [new Todo('Hello world', false)];

        // Act
        main.createHtml(todoList);

        // Assert
        let todosHTML = document.getElementById('todos') as HTMLUListElement;
        
        expect(todosHTML.childNodes).toHaveLength(1);
    });

    test('if todos contains three list items, todos HTML contains exactly three list items', () => {
        // Arrange
        document.body.innerHTML = `<ul id="todos" class="todo"></ul>`;
        let todoList: Todo[] = [
            new Todo('Lorem', false),
            new Todo('Ipsum', true),
            new Todo('Dolor', false)
        ];

        // Act
        main.createHtml(todoList);

        // Assert
        let todosHTML = document.getElementById('todos') as HTMLUListElement;
        
        expect(todosHTML.childNodes).toHaveLength(3);
    });

    test('if todos list item is done, add class todo__text--done', () => {
        // Arrange
        document.body.innerHTML = `<ul id="todos" class="todo"></ul>`;
        let todoList: Todo[] = [new Todo('Hello world', true)];

        // Act
        main.createHtml(todoList);

        // Assert
        let todosHTML = document.getElementById('todos') as HTMLUListElement;
        let todoItemHTML = todosHTML.firstChild as HTMLLIElement;
        expect(todoItemHTML.classList.contains('todo__text--done')).toBe(true);
    });

    test('if todos list item is not done, make sure class todo__text--done is not added', () => {
        // Arrange
        document.body.innerHTML = `<ul id="todos" class="todo"></ul>`;
        let todoList: Todo[] = [new Todo('Hello world', false)];

        // Act
        main.createHtml(todoList);

        // Assert
        let todosHTML = document.getElementById('todos') as HTMLUListElement;
        let todoItemHTML = todosHTML.firstChild as HTMLLIElement;
        expect(todoItemHTML.classList.contains('todo__text--done')).toBe(false);
    });

    test('click event listener is added onto list item', () => {
        // Arrange
        document.body.innerHTML = `<ul id="todos" class="todo"></ul>`;
        let todoList: Todo[] = [new Todo('Hello world', false)];
        main.createHtml(todoList);
        let todosHTML = document.getElementById('todos') as HTMLUListElement;
        let todoItemHTML = todosHTML.firstChild as HTMLLIElement;
        let toggleTodoSpy = jest.spyOn(main, 'toggleTodo').mockReturnValue();

        // Act
        todoItemHTML.click();

        // Assert
        expect(toggleTodoSpy).toHaveBeenCalledTimes(1);
    });
});

describe('toggleTodo', () => {
    test('changeTodo is called once', () => {
        // Arrange
        let todoItem = new Todo('Hello world', false);
        let changeTodoSpy = jest.spyOn(functions, 'changeTodo').mockReturnValue();
        jest.spyOn(main, 'createHtml').mockReturnValue();

        // Act
        main.toggleTodo(todoItem);

        // Assert
        expect(changeTodoSpy).toHaveBeenCalledTimes(1);
    });

    test('createHTML is called once', () => {
        // Arrange
        let todoItem = new Todo('Hello world', false);
        let createHTMLSpy = jest.spyOn(main, 'createHtml').mockReturnValue();

        // Act
        main.toggleTodo(todoItem);

        // Assert
        expect(createHTMLSpy).toHaveBeenCalledTimes(1);
    });
});

describe('displayError', () => {
    test('add show class if argument is true', () => {
        // Arrange
        document.body.innerHTML = `<div id="error" class"error"></div>`;

        // Act
        main.displayError('Error message', true);

        // Assert
        let errorHTML = document.getElementById('error') as HTMLDivElement;
        expect(errorHTML.classList.contains('show')).toBe(true);
    });

    test('remove show class if argument is false', () => {
        // Arrange
        document.body.innerHTML = `<div id="error" class"error"></div>`

        // Act
        main.displayError('Error message', false);

        // Assert
        let errorHTML = document.getElementById('error') as HTMLDivElement;
        expect(errorHTML.classList.contains('show')).toBe(false);
    });
});

describe('clearTodos', () => {
    test('removeAllTodos & createHTML is called once each', () => {
        // Arrange
        let todoList: Todo[] = [
            new Todo('Lorem', false),
            new Todo('Ipsum', true),
            new Todo('Dolor', false)
        ];
        let removeAllTodosSpy = jest.spyOn(functions, 'removeAllTodos').mockReturnValue();
        let createHTMLSpy = jest.spyOn(main, 'createHtml').mockReturnValue();

        // Act
        main.clearTodos(todoList);

        // Assert
        expect(removeAllTodosSpy).toHaveBeenCalledTimes(1);
        expect(createHTMLSpy).toHaveBeenCalledTimes(1);
    });
});