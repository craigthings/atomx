import "./Counter.css";
import React from 'react';
import { Subscriber, state } from "../atomx";

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


// Functional Component Example

// import { subscribe, state } from "../atomx";
// let count = state<number>(0);

// function CountExample() {
//   subscribe(count);

//   function increment() {
//     count.set(count.get() + 1);
//   }
//   function decrement() {
//     count.set(count.get() - 1);
//   }

//   function incrementIfOdd() {
//     if (count.get() % 2 !== 0) {
//       increment();
//     }
//   }

//   function incrementAsync() {
//     setTimeout(increment, 1000)
//   }

//   return (
//     <div className="counter-example">
//       <p>
//         Clicked: {count.get()} times {' '}
//         <button onClick={increment}>+</button>{' '}
//         <button onClick={decrement}>-</button>{' '}
//         <button onClick={incrementIfOdd}>Increment if odd</button>{' '}
//         <button onClick={incrementAsync}>Increment async</button>
//       </p>
//     </div>
//   );
// }

export default CountExample;
