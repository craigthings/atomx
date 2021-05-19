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
import { Store, state } from "atomx-state";

class CounterStore extends Store {
  count = state(0);
  
  constructor() {
    super();
    this.init(); // initialize this store
  }

  increment = () => {
    this.count.set(this.count.get() + 1);
  }
}
```

## Using Functions ❗ **NOT YET AVAILABLE** ❗

### Component State:

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
import { Store } from "atomx-state";

export default Store(store => ({
  count: state(0),
  increment() {
    store.count.set(store.count.get() + 1);
  }
}));
```

Alternative method:

```jsx
import { Store } from "atomx-state";

let count = state(0);

function increment(){
  count.set(count.get() +)
}

export default Store({count})

```

## Future features...

- Functional component support.
- Time travel
- Debugger
- Rehydration

## Working Online Examples

> In progress...

# API

## ⚛ Atomx State 

"State" is an piece of atomic state. It can be `get`, `set`, `subscribed` to, listened to (using `on` or `off`), and `dispatch`ed from. Sometimes you need your app to react to a specific event, and not just change based on what state you've subscribed to.

### `state(value: any)`

```javascript
// Creating new atomic state

// JavaScript
count = state(0);

// TypeScript
count = state<Number>(0);
```
Create a new instance of state;

### `State.get()`

```javascript
count.get(); // 0
```

Returns the value of the state.

### `State.set(state: Object)`

```javascript
Store.set();
```
Sets the value of the state.

### `State.reset()`

```javascript
count.reset();
```
Resets the value in the state.

### `State.on(eventName: string, payload: any)`

```javascript
count.on(StoreEvents.CHANGED, changeHandler);

function changeHandler(storeReferece){
    console.log('Store changed!')
}
```
Add an event listener to your state. Only event currently dispatched is `StoreEvents.CHANGED` when the state value is changed.

### `State.off(eventName: string, handlerFunction: Function)`

```javascript
count.off(StateEvents.CHANGED, changeHandler);
```
Remove an event listener from your state.


### `State.dispatch(eventName: string, payload: any)`

```javascript
count.dispatch('INCREMENT', count.get());

// Somewhere else in your app

count.on('INCREMENT', countIncrementHandler);
```
Dispatch an event from your state.

## 🔒 Atomx Store

A store is a way to contain and manage multiple atomic states and actions on those states. It is also an event dispatcher, and has some other convenience features. You could build your own version of this using the principles above of atomic state, but this is our "batteries included" API for storing all your state.

The examples below assume this global state matches the counter example found near the beginning of the document.

### `Store.get()`

```javascript
Store.get(); // { count: 0 };
```

Transforms all atomic states within the store into a flat object.

### `Store.set(state: Object)`

```javascript
Store.set({
  count: Store.count.get() + 1
});
```
Set any matching atomic state using and object.

### `Store.subscribe(changeHandler: Function)`

```javascript
Store.subscribe(storeChangeHandler);

function storeChangeHandler(storeReference){
  console.log('Store changed!')
}

```

Subscribe a handler to any changes to the store. The handler will be called when any state within the store changes.

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
Add an event listener to your store. Only event currently dispatched is `StoreEvents.CHANGED` when any atomic state within the store is changed.

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

## 📚 Atomx Collection

A `collection` is similar to a store is instead a list of states that can be retrieved, added and removed.

Example:

```javascript
import { Store, state } from "atomx-state";

class Counter extends Store {
  count = state(0);
  
  constructor(initialValue) {
    super();
    if(initialValue) count.set(initialValue);
    this.init(); // initialize this store
  }

  increment = () => {
    this.count.set(this.count.get() + 1);
  }
}

export class MainStore extends Store {
  counters = collection();

  constructor() {
    super();
    this.init(); // initialize this store
  }

  addCounter = () => {
    let i = 10;
    while(i--) {
      this.counters.add(new Counter(i));
    }
  };

  incrementAll = () => {
    this.counters.get().forEach(counter => counter.increment());
  }
}
```

### `collection(value: any)`

```javascript
// Creating new atomic state

// JavaScript
count = collection();

// TypeScript
count = collection<TodoItem>();
```
Create a new instance of a collection;

### `Collection.get()`

```javascript
collection.get(); // [ counter1, counter2, counter3, ...];
```

Transforms all state within the store into a flat object.

### `Collection.set(state: Object)`

```javascript
collection.set();
```
Set state using and object with matching state names.

### `Collection.subscribe(callback: Function)`

```javascript
collection.subscribe(storeChangeHandler);

function storeChangeHandler(storeReference){
  console.log('Store changed!')
}

```
Set state using and object with matching state names.

### `Collection.reset()`

```javascript
collection.reset();
```
Resets all state found within the store to their original values.

### `Collection.on(eventName: string, payload: any)`

```javascript
collection.on(StoreEvents.ADDED, addHandler);

function addHandler(collectionReferece){
    console.log('Item added!')
}
```
Add an event listener to your store. Available `collection events` to dispatch are: 

>*`CollectionEvents.CHANGED`*

>*`CollectionEvents.ADDED`*

>*`CollectionEvents.REMOVED`*

### `Collection.off(eventName: string, handlerFunction: Function)`

```javascript
collection.off(StoreEvents.ADDED, addHandler);
```
Remove an event listener to your store.

### `Collection.dispatch(eventName: string, payload: any)`

```javascript
collection.dispatch('LOAD_COMPLETE', loadHandler);

// Somewhere else in your app

collection.on('LOAD_COMPLETE', loadHandler);
```
Dispatch an event from your collection.

## 📚 Atomx Computed State

The value of `Computed State` updates when any state within a referenced store changes.

Example:

```javascript
import { Store, state } from "atomx-state";

class CounterStore extends Store {
  count = state(0);
  countPlusTen = computed(this, () => {
    return this.count.get() + 10;
  });
  
  constructor(initialValue) {
    super();
    this.init(); // initialize this store
  }

  increment = () => {
    this.count.set(this.count.get() + 1);
  }
}

// Elsewhere in your app...

countPlusTen.get(); // 10
CountPlusTen.on(StateEvents.CHANGE, (stateReference) => {
  stateReference.get(); // 10;
})
```


### `collection(storeReference: Object | any, computeFunction: function)`

```javascript
countPlusTen = computed(MyStore, () => {
  return MyStore.count.get() + 10;
});
```
Create a new instance of computed state. This often exists inside a global store.

### `Computed.get()`

Returns the value of the computed state.

### `Computed.subscribe(callback: Function)`

```javascript
collection.subscribe(computedChangeHandler);

function computedChangeHandler(stateReference){
  console.log('Computed changed!')
}

```

Subscribe a function to any changes in the computed state.

### `Computed.on(eventName: string, payload: any)`

```javascript
collection.on(StoreEvents.ADDED, addHandler);

function addHandler(collectionReferece){
    console.log('Item added!')
}
```
Add an event listener to your store. The available `collection event` to dispatch is: 

> *`CollectionEvents.CHANGED`*


### `Collection.off(eventName: string, handlerFunction: Function)`

```javascript
collection.off(CollectionEvents.CHANGED, changeHandler);
```
Remove an event listener from your computed state.

## Testing

```javascript
test('counter', t => {
  let store = new CounterStore();
  t.assert(store.count.get() === 0);

  increment();
  t.assert(store.count.get() === 1);

  t.end();
})
```