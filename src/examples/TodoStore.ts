import Atom from "../atomx";
import { uid, state, computed, collection } from "../atomx";

export class TodoItem extends Atom.Store {
  name = state<string>("");
  isCompleted = state<boolean>(false);
  isEditing = state<boolean>(false);
  status = computed<TodoStatus>(this, () => {
    if (this.isCompleted.get()) return TodoStatus.COMPLETED;
    else return TodoStatus.ACTIVE
  });
  id = uid();

  constructor(name: string, isCompleted: boolean) {
    super();
    this.name.set(name);
    this.isCompleted.set(isCompleted || false);
    this.init();
  }

  toggleCompleted = () => {
    this.isCompleted.set(!this.isCompleted.get());
  }
}

export enum TodoStatus {
  NONE = 'none',
  COMPLETED = 'completed',
  ACTIVE = 'active'
}

export class MainStore extends Atom.Store {
  todos = collection<TodoItem>();
  filter = state<TodoStatus>(TodoStatus.NONE);
  filtered = computed<Array<TodoItem>>(this, () => {
    if (this.filter.get() === TodoStatus.NONE) return this.todos.get();
    if (this.filter.get() === TodoStatus.COMPLETED) return this.todos.get().filter(todo => todo.status.get() === TodoStatus.COMPLETED);
    if (this.filter.get() === TodoStatus.ACTIVE) return this.todos.get().filter(todo => todo.status.get() === TodoStatus.ACTIVE);
  })
  title = state<string>("some title");

  constructor() {
    super();
    this.init();
  }

  addTodo = (name: string, completed = false) => {
    this.todos.add(new TodoItem(name, completed));
  };

  removeTodo = (item: TodoItem) => {
    this.todos.remove(item);
  };
}

export default new MainStore();