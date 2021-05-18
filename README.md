# ⚛ AtomX (Alpha) - Predictable and Scalable Atomic State

> This project is in an *Alpha* stage of development. We are looking for feedback and pull requests to make this better state management for more people.

State management is a problem that's relatively easy to solve with simple, and early stage web apps. But as apps grow in complexity, often state can start to behave unpredictably, or start becoming extremely verbose and hard to manage. Atomx is designed to be as straight forward as possible, while keeping state predictable and (more importantly) scalable. AtomX is designed to support  JavaScript and TypeScript using code structure that's intended to be familiar and IDE friendly.

AtomX is built on a principle that all state should be "atomic". To put it another way, all values are a single bit of state. Strings, numbers, or any other data. AtomX state can be created and managed within any context. Use a global store, or use state within a component.

## Installing

Platform independent library: 

`npm install atomx-state`

React based library: 

`npm install atomx-state-react`

# Examples

## Using Classes

### Component State:

```jsx
import { state, Subscriber } from "atomx-state";

class CountExample extends Subscriber(React.Component) { // extend our component to support subscribing to atomic state.
  count = state(0); // create initial atomic state.
  
  increment = () => this.count.set(this.count.get() + 1); // action to add 1 to state.

  render() {
    this.subscribe(this.count); // subscribe to the state so our component renders when the value is changed via .set()
    let count = this.count.get(); // get and save the current value into a variable.
    return (
        <p>
          Clicked: {count} times.
          <button onClick={this.increment}>+</button>
        </p>
    );
  }
}
```

### Global State:

```javascript
import Atom from "atomx-state";
import { state } from "atomx-state";

class CounterStore extends Atom.Store {
  count = state(0);
  
  constructor() {
    super();
    this.init(); // initialize this store
  }

  increment = () => {
    this.count.set(this.count.get() + 1);
  }
  decrement = () => {
    this.count.set(this.count.get() - 1);
  }
}
```

## Using Functions ❗ **NOT YET AVAILABLE** ❗

### Local State:

```jsx
import { state, subscribe } from "atomx-state-react";

let count = state(0); // create initial atomic state.

function CountExample { // extend our component to support subscribing to atomic state.
  
  
  let increment = () => count.set(count.get() + 1); // action to add 1 to state.
  subscribe(count); // subscribe to the state so our component renders when the value is changed via .set()

  render() {
    return (
        <p>
          Clicked: {count.get()} times.
          <button onClick={this.increment}>+</button>
        </p>
    );
  }
}
```

### Global State:

```jsx
import { Store, subscribe } from "atomx-state-react";

export default Store(store => ({
  count: state(0),
  increment() {
    store.count.set(store.count.get() + 1);
  }
}));

```

## Future features...

- Functional component support.
- Time travel
- Debugger
- Rehydration

## Working Online Examples

> In progress...

# API

## Atomx Store

A store contains multiple atomic states and actions on that state. It is also an event dispatcher.

The references below assume this global state matches the example found above.

### `Store.get()`

```javascript
Store.get(); // { count: 0 };
```

Transforms all state within the store into a flat object.

### `Store.set(state: Object)`

```javascript
Store.set({
  count: Store.count.get() + 1
});
```
Set state using and object with matching state names.

### `Store.reset()`

```javascript
Store.reset();
```
Resets all state found within the store to their original values.

### `Store.on(eventName: string, payload: any)`

```javascript
Store.on(StoreEvents.CHANGED, changeHandler);

function changeHandler(storeReferece){
    console.log('Store changed!')
}
```
Add an event listener to your store. Only event currently dispatched is `StoreEvents.CHANGED` when any atomic state is changed.

### `Store.off(eventName: string, handlerFunction: Function)`

```javascript
Store.off(StoreEvents.CHANGED, changeHandler);)
```
Remove an event listener to your store.


### `Store.off(eventName: string, handlerFunction: Function)`

```javascript
Store.off(StoreEvents.CHANGED, changeHandler);)
```
Remove an event listener to your store.

### `Store.dispatch(eventName: string, payload: any)`

```javascript
UserStore.dispatch('LOGIN_SUCCESSFUL', userData);

// Somewhere else in your app

UserStore.on('LOGIN_SUCCESSFUL', userLoginHandler);
```
Dispatch an event from your store.




## Testing

Testing using [tape](https://github.com/substack/tape):

```javascript
import * as test from 'tape'
import { CounterStore } from './CounterStore'

test('counter', t => {
  CounterStore.reset()
  t.assert(CounterStore.count.get() === 0)

  increment()
  t.assert(CounterStore.count.get() === 1)

  decrement()
  t.assert(CounterStore.count.get() === 0)

  t.end()
})
```