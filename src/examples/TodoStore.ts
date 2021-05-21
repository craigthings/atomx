import { Store, uid, state, computed, collection } from "../atomx";

export enum TodoStatus {
  NONE = 'none',
  COMPLETED = 'completed',
  ACTIVE = 'active'
}

export class TodoItem extends Store {
  name = state<string>("");
  isCompleted = state<boolean>(false);
  isEditing = state<boolean>(false);
  id = uid();
  status = computed<TodoStatus>(this, () => {
    if (this.isCompleted.get()) return TodoStatus.COMPLETED;
    else return TodoStatus.ACTIVE
  });

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

export class MainStore extends Store {
  title = state<string>("My Todos");
  todos = collection<TodoItem>();
  filter = state<TodoStatus>(TodoStatus.NONE);
  filtered = computed<Array<TodoItem>>(this, () => {
    if(this.filter.get() === TodoStatus.NONE) return this.todos.get();
    return this.todos.get().filter(todo => todo.status.get() === this.filter.get() );
  });

  constructor() {
    super();
    this.init();
  }

  addTodo = (name: string, completed = false) => {
    this.todos.add(new TodoItem(name, completed));
    console.log(this.todos.filter(todo => todo.completed));
  };

  removeTodo = (item: TodoItem) => {
    this.todos.remove(item);
  };
}

export default new MainStore();