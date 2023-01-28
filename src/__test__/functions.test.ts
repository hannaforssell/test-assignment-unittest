import { addTodo, changeTodo, removeAllTodos } from "../ts/functions";
import { Todo } from "../ts/models/Todo";

describe('addTodo', () => {
    test('inserted item placed last', () => {
        // Arrange
        let todoList: Todo[] = [new Todo('Lorem', false)];
        let todoText = 'Hello world';

        // Act
        addTodo(todoText, todoList);

        // Assert
        expect(todoList[todoList.length - 1].text).toBe(todoText);
    });

    test('item is added to array', () => {
        // Arrange
        let todoList: Todo[] = [];
        let todoText = 'Hello world';

        // Act
        addTodo(todoText, todoList);

        // Assert
        expect(todoList).toEqual(expect.arrayContaining([expect.objectContaining({text: todoText})]));
    });

    test('fail to add todo item because item is too short', () => {
        // Arrange
        let todoList: Todo[] = [];
        let todoText = 'H';

        // Act
        addTodo(todoText, todoList);

        // Assert
        expect(todoList).toStrictEqual([]);
    });
});

describe('changeTodo', () => {
    test('check off item successfully', () => {
        // Arrange
        let todoItem = new Todo('Hello world', false);

        // Act
        changeTodo(todoItem);

        // Assert
        expect(todoItem.done).toBe(true);
    });

    test('uncheck item successfully', () => {
        // Arrange
        let todoItem = new Todo('Hello world', true);

        // Act
        changeTodo(todoItem);

        // Assert
        expect(todoItem.done).toBe(false);
    });
});

describe('removeAllTodos', () => {
    test('removes all items successfully', () => {
        // Arrange
        let todoList: Todo[] = [
            new Todo('Lorem', false),
            new Todo('Ipsum', true),
            new Todo('Dolor', false)
        ];

        // Act
        removeAllTodos(todoList);

        // Assert
        expect(todoList.length).toBe(0);
    });
});