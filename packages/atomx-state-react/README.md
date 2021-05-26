# ⚛ AtomX (Alpha) - Predictable and Scalable Atomic State

> Currently in ***Alpha*** stage of development. We are looking for feedback and pull requests to make this better state management for more people.

AtomX is a scalable atomic state based state management framework designed for React, but can work with any framework with a render function.

Core principles:

 - **Scalable** - API simple enough for prototyping, explicit enough for large scale apps.
 - **Familiar** - Built to allow syntax that is similar to other workflows and frameworks.
 - **Predictable** - All changes to state are explicitly subscribed to, and directly changed.
 - **Flexible** - Atomic state can be built into many different programming patterns and workflows.
 - **Batteries Included** - Fully supports TypeScript and JavaScript, and includes many components and APIs to make managing atomic state easier in large scale apps.

Core components:

 - [**State**](#⚛-state) - A single atomic value that has a getter, setter, and is an event dispatcher.
 - [**Store**](#🔒-store) - A container for multiple atomic states. It has a getter, setter, and is an event dispatcher.
 - [**Collection**](#📚-collection) - A list-like structure containing atomic states, which also has a getter, setter, and is an event dispatcher.
 - [**Subscribing**](#📬-subscribing) - All AtomX structures can be subscribed to, and have event listeners.
 - [**Computed State**](#📚-computed-state) - State that's value is derived from changes to other state.

<!-- State management is a problem that's relatively easy to solve with simple, and early stage web apps. But as apps grow in complexity, often state can start to behave unpredictably, or a codebase can start to become extremely verbose and hard to manage. AtomX is designed to be as straightforward as possible, while keeping state predictable and (more importantly) scalable. AtomX is designed to support  JavaScript and TypeScript using code structure that's intended to be familiar and IDE friendly.

AtomX is built on a principle that all state should be "atomic". To put it another way, all values are a single bit of state. Strings, numbers, or any other data. AtomX state can be created (and subscribed to) in any scope. Use a global store, or use state within a component. -->

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

// extend our component to support subscribing to atomic state
class CountExample extends Subscriber(React.Component) { 
  // create initial atomic state
  name = state('My Counter');
  count = state(0); 
  
  increment = () => this.count.set(this.count.get() + 1); // action to add 1 to state

  render() {
    this.subscribe(this.count, this.name); // subscribe to the state changes
    // get and save the current value into variables
    let count = this.count.get(); 
    let name = this.name.get();
    return (
        <p>
          {name} Clicked: {count} times.
          <button onClick={this.increment}>+</button>
          <input 
            type="text" 
            value={ name.get() } 
            onChange={ (e) => name.set(e.target.value) }
          >
        </p>
    );
  }
}
```
<details>
  <summary>TypeScript Example</summary>

  ```tsx
  import { state, Subscriber } from "atomx-state";

// extend our component to support subscribing to atomic state
  class CountExample extends Subscriber(React.Component) { 
    // create initial atomic state
    name = state<string>('My Counter');
    count = state<number>(0); 
    
    increment = () => this.count.set(this.count.get() + 1); // action to add 1 to state

    render() {
      this.subscribe(this.count, this.name); // subscribe to the state changes
      // get and save the current value into variables
      let count: number = this.count.get(); 
      let name: string = this.name.get();
      return (
          <p>
            {name} Clicked: {count} times.
            <button onClick={this.increment}>+</button>
            <input 
              type="text" 
              value={ name.get() } 
              onChange={ (e) => name.set(e.target.value) }
            >
          </p>
      );
    }
  }
  ```
</details>

### Global State:

```javascript
import { Store, state } from "atomx-state";

class CounterStore extends Store {
  count = state(0);
  name = state('Unnamed Counter');
  
  constructor() {
    super();
    this.init(); // initialize this store
  }

  increment = () => {
    this.count.set(this.count.get() + 1);
  }

  setName = (name) => {
    this.name.set(name);
  }
}
```
<details>
  <summary>TypeScript Example</summary>

  ```typescript
  import { Store, state } from "atomx-state";

  class CounterStore extends Store {
    count = state<number>(0);
    name = state<string>('Unnamed Counter');
    
    constructor() {
      super();
      this.init(); // initialize this store
    }

    increment = () => {
      this.count.set(this.count.get() + 1);
    }

    setName = (name) => {
      this.name.set(name);
    }
  }
  ```
</details>

## Using Functional Components

### Component State:

```jsx
import { state } from "atomx-state";
import { subscribe } from "atomx-state-react";
// create initial atomic state.
let count = state(0); 
let name = state('My Counter');

function CountExample {
  
  let increment = () => count.set(count.get() + 1); // action to add 1 to state
  subscribe(count, name); // subscribe to the state changes

  render() {
    return (
        <p>
          {name.get()} Clicked: {count.get()} times.
          <button onClick={this.increment}>+</button>
          <input 
            type="text" 
            value={ name.get() } 
            onChange={ (e) => name.set(e.target.value) }
          >
        </p>
    );
  }
}
```
<details>
  <summary>TypeScript Example</summary>

  ```tsx
  import { state, subscribe } from "atomx-state";
  // create initial atomic state.
  let count = state<number>(0);
  let name = state<string>('My Counter');

  function CountExample {
    
    
    let increment = () => count.set(count.get() + 1); // action to add 1 to state.
    subscribe(count, name); // subscribe to the state changes

    render() {
      return (
          <p>
            {name.get()} Clicked: {count.get()} times.
            <button onClick={this.increment}>+</button>
            <input 
              type="text" 
              value={ name.get() } 
              onChange={ (e) => name.set(e.target.value) }
            >
          </p>
      );
    }
  }
  ```
</details>

<!-- ### Global State:
```jsx
import { makeStore } from "atomx-state";

export default makeStore(store => ({
  count: state(0),
  increment() {
    store.count.set(store.count.get() + 1);
  }
}));
``` -->

<!-- Alternative method:

```jsx
import { Store } from "atomx-state";

let count = state(0);

function increment(){
  count.set(count.get() +)
}

export default Store({count}) 

```
-->

## Future features...

- Time travel
- Debugger
- Rehydration

## Working Online Examples

> In progress...

# **AtomX API**

# ⚛ State 

"State" is a piece of atomic state. It can be `get`, `set`, `subscribed` to, listened to (using `on` or `off`), and `dispatch`ed from. Sometimes you need your app to react to a specific event, and not just change based on what state you've subscribed to.

### `state(value: any)`

```javascript
// Creating new atomic state

// JavaScript
count = state(0);

// TypeScript
count = state<number>(0);
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
Resets the value in the state to the initial value, even if the original value is undefined.

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

# 🔒 Store

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

### `Store.init()`

```javascript
Store.get(); // { count: 0 };
```

Usually called in the constructor of a new store. This initializes the store, making sure that all state in the store is subscribed to.

# 📚 Collection

A `collection` stores a list of states. State can be added, removed, retrieved, and changed.

Example:

```javascript
import { Store, state } from "atomx-state";

class TodoItem extends Store {
  name = state('');
  completed = state(false);
  
  constructor(initialName) {
    super();
    if(initialName) this.name.set(initialName);
    this.init(); // initialize this store
  }

  done = () => {
    this.completed.set(true);
  }
}

export class Todo extends Store {
  todos = collection();

  constructor() {
    super();
    this.init(); // initialize this store
  }

  addTodo = (name: String) => {
    this.counters.add(new TodoItem(name));
  };
}
```
<details>
  <summary>TypeScript Example</summary>

  ```typescript
import { Store, state } from "atomx-state";

class TodoItem extends Store {
  name = state<string>('');
  completed = state<boolean>(false);
  
  constructor(initialName: boolean) {
    super();
    if(initialName) this.name.set(initialName);
    this.init(); // initialize this store
  }

  done = () => {
    this.completed.set(true);
  }
}

export class Todo extends Store {
  todos = collection<TodoItem>();

  constructor() {
    super();
    this.init(); // initialize this store
  }

  addTodo = (name: String) => {
    this.counters.add(new TodoItem(name));
  };
}
  ```
</details>


### `collection(value: any)`

```javascript
// Creating new atomic state

// JavaScript
count = collection();

// TypeScript
count = collection<TodoStore>();
```
Create a new instance of a collection;

### `Collection.get()`

```javascript
collection.get(); // [ counter1, counter2, counter3, ...];
```

Returns all state within the collection as an array.

### `Collection.set(state: Object)`

```javascript
collection.set([counter1, counter2, counter3]);
```
Replaces the collection with a new array of values.

### `Collection.subscribe(callback: Function)`

```javascript
collection.subscribe(storeChangeHandler);

function collectionChangeHandler(collectionReference){
  console.log('Store changed!')
}

```
Subscribe a handler to the collection that will be called when an item is added, removed, or changed.

### `Collection.filter( filterFunction: (value: CollectionType, index: number, array: CollectionType[]) )`

```javascript
let completed = collection.filter( todo => todo.isCompleted.get() === true );
```
Returns a filtered array of results where the filter function returns true.



### `Collection.reset()`

```javascript
collection.reset();
```
Resets the collection to its initial state, even if that's empty.

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

# 📚 Computed State

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

# 📬 Subscribing

## Subscriber Component

### `Subscriber(Component: Class)`

You can turn your component into a Subscriber so that it's easier to manage subscribing to state. 

> Using a different framework's component? Make sure it contains either a `.forceUpdate` method or `.render` method.

### `this.subscribe(stateReference: State | Store | Collection | Computed, stateReference, ...)`

```javascript
// In Class scope
this.subscribe(count, title);
```

Subscribe to a single or multiple states. If either are changed, your component will be updated.

### Example:

```javascript
class CountExample extends Subscriber(React.Component) {
  count = state<number>(0);

  componentWillUnmount = () => {
    this.unsubscribeAll(); // Unsubscribe from all state you've subscribed to before unmounting.
  }

  render() {
    this.subscribe(count); // Subscribe to your state.
    return (
      <div>
          Clicked: {this.count.get()} times {' '}
          <button onClick={this.increment}>+</button>{' '}
      </div>
    );
  }
}
```

## Subscribe Hook

### `subscribe(stateReference: State | Store | Collection | Computed, stateReference, ...)`

You can subscribe to state in your functional React component using the custom `subscribe` hook.

```javascript
// In Function scope
subscribe(count, title);
```

Subscribe to a single or multiple states. If either are changed, your component will be updated.

### Example:

```javascript
let count = state<number>(0);

function Count() {
  subscribe(count); // Subscribe to the state using the subscribe hook.

  function increment() {
    count.set(count.get() + 1);
  }

  return (
    <div>
        Clicked: {count.get()} times {' '}
        <button onClick={increment}>+</button>{' '}
    </div>
  );
}
```


# 🤖 Testing

```javascript
test('counter', t => {
  let store = new CounterStore();
  t.assert(store.count.get() === 0);

  store.increment();
  t.assert(store.count.get() === 1);

  t.end();
})
```