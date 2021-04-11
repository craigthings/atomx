import "./Counter.css";
import Atom from "../atomx";
import AtomComponent from "../atomx-react/AtomComponent";
import { state } from "../atomx";

class MainStore extends Atom.Store {
  count = state<number>(0);

  increment = () => {
    this.count.set(this.count.get() + 1);
  }
  decrement = () => {
    this.count.set(this.count.get() - 1);
  }
}

let store = new MainStore();

class CountExample extends AtomComponent {
  
  incrementIfOdd() {
    if (store.count.get() % 2 !== 0) {
      store.increment();
    }
  }

  incrementAsync() {
    setTimeout(store.increment, 1000)
  }

  render() {
    this.subscribe(store);

    return (
      <div className="counter-example">
        <p>
          Clicked: {store.count.get()} times {' '}
          <button onClick={store.increment}>+</button>{' '}
          <button onClick={store.decrement}>-</button>{' '}
          <button onClick={this.incrementIfOdd}>Increment if odd</button>{' '}
          <button onClick={this.incrementAsync}>Increment async</button>
        </p>
      </div>
    );
  }
}

export default CountExample;
