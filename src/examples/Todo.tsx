import "./Todo.css";
import AtomComponent from "../atomx-react/AtomComponent";
import store from './TodoStore';
import { state } from '../atomx';
import { TodoItem } from './TodoStore'

class TodoExample extends AtomComponent {
  render() {
    let todos = store.filtered.get();
    this.subscribe(store.filtered);
    console.log('render');
    return (
      <div className="todo-example">
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

window['store'] = store;

class TodoRow extends AtomComponent<{ todo: TodoItem, removeTodo: Function }>{
  // status = this.props.todo.status;

  componentDidMount = () => {
    // this.status.subscribe((e: any) => console.log(e.value))
  }

  componentWillUnmount = () => {
    this.unsubscribeAll();
  }

  render() {
    let todo = this.props.todo;
    let removeTodo = this.props.removeTodo;

    let { name, isCompleted, isEditing } = todo;

    this.subscribe(todo);

    return (
      <div className="todo">
        <input
          className={"name-input" + isEditing.get() ? 'editing' : ''}
          style={{
            border: isEditing.get() ? '' : '0px',
            outlineWidth: isEditing.get() ? '' : '0px',
            textDecoration: isCompleted.get() ? "line-through" : "",
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

class TodoForm extends AtomComponent<{
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
      <form className="todo-form" onSubmit={this.handleSubmit}>
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

export default TodoExample;
