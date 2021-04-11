import Atom from "../atomx";
import { uid, state, computed, collection } from "../atomx";

export class TodoItem extends Atom.Store {
    name = state<string>("");
    isCompleted = state<boolean>(false);
    isEditing = state<boolean>(false);
    status = computed<string>(this, () => {
      if (this.isCompleted.get()) return "done!";
      else return "not done."
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
  
  class MainStore extends Atom.Store {
    todos = collection<TodoItem>();
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