import "./Counter.css";
import Atom from "../atomx";
import AtomComponent from "../atomx-react/AtomComponent";
import React from 'react';
import { state, Subscriber } from "../atomx";

// class MainStore extends Atom.Store {
//   count = state<number>(0);

//   increment = () => {
//     this.count.set(this.count.get() + 1);
//   }
//   decrement = () => {
//     this.count.set(this.count.get() - 1);
//   }
// }

// let store = new MainStore();

class CountExample extends Subscriber(React.Component) {
  count = state<number>(0);

  increment = () => {
    this.count.set(this.count.get() + 1);
  }
  decrement = () => {
    this.count.set(this.count.get() - 1);
  }

  incrementIfOdd = () => {
    if (this.count.get() % 2 !== 0) {
      this.increment();
    }
  }

  incrementAsync = () => {
    setTimeout(this.increment, 1000)
  }

  render() {
    this.subscribe(this.count);
    
    return (
      <div className="counter-example">
        <p>
          Clicked: {this.count.get()} times {' '}
          <button onClick={this.increment}>+</button>{' '}
          <button onClick={this.decrement}>-</button>{' '}
          <button onClick={this.incrementIfOdd}>Increment if odd</button>{' '}
          <button onClick={this.incrementAsync}>Increment async</button>
        </p>
      </div>
    );
  }
}

export default CountExample;
