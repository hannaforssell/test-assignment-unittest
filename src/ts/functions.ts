import { IAddResponse } from "./models/IAddResult";
import { Todo } from "./models/Todo";

export function addTodo(todoText: string, todos: Todo[]): IAddResponse {
  if (todoText.length > 2) {
    let newTodo = new Todo(todoText, false);
    todos.push(newTodo);
    return { success: true, error: "" };
  } else {
    return { success: false, error: "Du måste ange minst tre bokstäver" };
  }
}

export function changeTodo(todo: Todo) {
  todo.done = !todo.done;
}

export function removeAllTodos(todos: Todo[]) {
  todos.splice(0, todos.length);
}

export function sortList(todos: Todo[]) {
  todos.sort((item1: Todo, item2: Todo) => {
    if (item1.done && !item2.done) {
      return 1;
    }
    if (!item1.done && item2.done) {
      return -1;
    }

    return item1.text.localeCompare(item2.text);
  });  
}