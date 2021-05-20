import "./Counter.css";
import Atom from "../atomx";
import AtomComponent from "../atomx-react/AtomComponent";
import React from 'react';
import { subscribe, state } from "../atomx";

// class CountExample extends Subscriber(React.Component) {
//   count = state<number>(0);

//   increment = () => {
//     this.count.set(this.count.get() + 1);
//   }
//   decrement = () => {
//     this.count.set(this.count.get() - 1);
//   }

//   incrementIfOdd = () => {
//     if (this.count.get() % 2 !== 0) {
//       this.increment();
//     }
//   }

//   incrementAsync = () => {
//     setTimeout(this.increment, 1000)
//   }

//   render() {
//     this.subscribe(this.count);

//     return (
//       <div className="counter-example">
//         <p>
//           Clicked: {this.count.get()} times {' '}
//           <button onClick={this.increment}>+</button>{' '}
//           <button onClick={this.decrement}>-</button>{' '}
//           <button onClick={this.incrementIfOdd}>Increment if odd</button>{' '}
//           <button onClick={this.incrementAsync}>Increment async</button>
//         </p>
//       </div>
//     );
//   }
// }

let count = state<number>(0);
let countB = state<number>(0);

function CountExample() {
  subscribe(count);
  subscribe(countB);

  function increment() {
    count.set(count.get() + 1);
  }
  function incrementB() {
    countB.set(countB.get() - 1);
  }

  function incrementIfOdd() {
    if (count.get() % 2 !== 0) {
      increment();
    }
  }

  function incrementAsync() {
    setTimeout(increment, 1000)
  }

  console.log('RENDER');

  return (
    <div className="counter-example">
      <p>
        Clicked: {count.get()} {countB.get()} times {' '}
        <button onClick={increment}>+</button>{' '}
        <button onClick={incrementB}>+b</button>{' '}
        <button onClick={incrementIfOdd}>Increment if odd</button>{' '}
        <button onClick={incrementAsync}>Increment async</button>
      </p>
    </div>
  );
}

export default CountExample;
