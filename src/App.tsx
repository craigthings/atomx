import React from "react";
import "./App.css";
import Atom from "./atomx";
import { subscribe, state, computed, collection } from "./atomx";
import AtomCollection from "./atomx/AtomCollection";

class TodoItemStore extends Atom.Store {
  name = Atom.String("");
  isCompleted = Atom.Boolean(false);
  isEditing = Atom.Boolean(false);
  id = Atom.UID();

  constructor(name, isCompleted) {
    super();
    this.name.set(name);
    this.isCompleted.set(isCompleted || false);
    this.init();
  }

  toggleCompleted = () => {
    this.isCompleted.set(!this.isCompleted.get());
  }
}

class TodoStore extends Atom.Store {
    todos:AtomCollection<TodoItemStore> = collection();
    title = state("some title");

    constructor(){
        super();
        this.init();
    }

    addTodo = (name, completed = false) => {
      this.todos.add(new TodoItemStore(name, completed));
    };
  
    removeTodo = item => {
      this.todos.remove(item);
    };
}

// =======================================================================================================


let store = new TodoStore();



class App extends Atom.Component<{}> {
  render() {
    let todos = store.todos.get();
    this.subscribe(store.todos);

    return (
      <div className="app">
        <div className="todo-list">
          {todos.map((todo, index) => (
            <TodoItem
              key={String(todo.id.get())}
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

class TodoItem extends Atom.Component<{todo: TodoItem}, {}> {
  componentWillUnmount = () => {
    this.unsubscribeAll();
  }

  render() {
    let todo = this.props.todo;
    let removeTodo = this.props.removeTodo;
    this.subscribe(todo);

    return (
      <div className="todo" style={{ textDecoration: todo.isCompleted.get() ? "line-through" : "" }}>
          { todo.isEditing.get() ? 
            <input
              className="name-input"
              value={todo.name.get()} 
              onChange={ e => todo.name.set(e.target.value)}
              onKeyPress= { e => e.key === 'Enter' ? todo.isEditing.set(false) : null }>
            </input> 
            :
            <div className="name" onClick={e => todo.isEditing.set(true)}>{todo.name.get()}</div>
          }
        <div>
          <button onClick={todo.toggleCompleted}>Complete</button>
          <button onClick={() => removeTodo(todo)}>x</button>
        </div>
      </div>
    );
  }
}

class TodoForm extends Atom.Component {
  name = Atom.String('');

  handleSubmit = e => {
    e.preventDefault();
    if (!this.name) return;
    this.props.addTodo(this.name.get());
    this.name.set('');
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
