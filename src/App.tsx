import React from "react";
import "./App.css";
import Atom from "./atomx";
import { uid, state, computed, collection } from "./atomx";
// import AtomCollection from "./atomx/AtomCollection";

class TodoItem extends Atom.Store {
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

// =======================================================================================================


let store = new MainStore();
window["store"] = store;

class App extends Atom.Component {
  render() {
    let todos = store.todos.get();
    this.subscribe(store.todos);

    return (
      <div className="app">
        <div className="todo-list">
          {todos.map((todo, index) => (
            <TodoRow
              key={todo.id.get()}
              todo={todo}
              removeTodo={store.removeTodo}
            />
          ))}
          <TodoForm addTodo={store.addTodo} />
        </div>
      </div>
    );
  }
}

type Props = {
  todo: TodoItem,
  removeTodo: Function,
}

class TodoRow extends Atom.Component<Props>{

  constructor(props: Props) {
    super(props);
    props.todo.status.subscribe((e: any) => {
      console.log(e.value);
    })
  }

  componentWillUnmount = () => {
    this.unsubscribeAll();
  }

  render() {
    this.props.todo

    let todo = this.props.todo;
    let removeTodo = this.props.removeTodo;

    let { name, isCompleted, isEditing } = todo;

    this.subscribe(todo);

    return (
      <div className="todo" style={{ textDecoration: isCompleted.get() ? "line-through" : "" }}>
        <input
          className="name-input"
          style={{
            border: isEditing.get() ? '' : '0px',
            outlineWidth: isEditing.get() ? '' : '0px'
          }}
          value={name.get()}
          readOnly={!isEditing.get()}
          onMouseDown={e => { if (isEditing.get() === false) isEditing.set(true) }}
          onKeyPress={e => e.key === "Enter" ? isEditing.set(false) : null}
          onChange={e => { name.set(e.target.value); if (isEditing.get() === false) e.currentTarget.blur() }}
          onBlur={e => isEditing.set(false)}
        >
        </input>
        <div>
          <button onClick={todo.toggleCompleted}>Complete</button>
          <button onClick={() => removeTodo(todo)}>x</button>
        </div>
      </div>
    );
  }
}

class TodoForm extends Atom.Component<{
  addTodo: Function;
}> {
  name = state<string>("");

  handleSubmit = e => {
    e.preventDefault();
    if (!this.name) return;
    this.props.addTodo(this.name.get());
    this.name.set("");
  };

  render() {
    this.subscribe(this.name);
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          className="input"
          value={this.name.get()}
          onChange={e => this.name.set(e.target.value)}
        />
      </form>
    );
  }
}

export default App;
