import AtomCollection from './AtomCollection';
import AtomComputed from './AtomComputed';
import AtomStore from './AtomStore';
import AtomState from './AtomState';
import AtomSubscriber, { Platforms } from './AtomSubscriber';
import React from 'react';

import {
  AtomUID,
  AtomBoolean,
  AtomString,
  AtomNumber 
} from './AtomStateTypes';

type Constructor = new (...args: any[]) => {}

export function Subscriber<T extends Constructor>(Base: T) {
  return class Subscribing extends Base {
    _subscribedStates:Array<AtomSubscriber> = [];
    _renderFunc:Function = ()=>{}
    _platform:Platforms = Platforms.None;

    constructor(...args: any[]){
      super(...args);

      if(this["forceUpdate"]) {
        this._renderFunc = this["forceUpdate"];
        this._platform = Platforms.React;
      }
      else if(this["render"]) this._renderFunc = this["render"];
      this._renderFunc.bind(this);
    }
  
    subscribe = (atomState:AtomSubscriber) => {
      let exists = this._subscribedStates.filter((item) => item === atomState).length > 0;
      if (exists === false) {
        this._subscribedStates.push(atomState);
      }
      atomState.subscribe(this._renderFunc, this, this._platform);
    };
  
    unsubscribe = (atomState:AtomSubscriber) => {
      this._subscribedStates
        .filter((subscribedAtomState) => subscribedAtomState === atomState)
        .forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this._renderFunc));
    };
  
    unsubscribeAll = () => {
      this._subscribedStates.forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this._renderFunc));
    };
  }
}

export function state<T = any>(defaultValue?:T) {
  let newState:AtomState<T> = new AtomState(defaultValue);
  return newState;
}

export function collection<T = any>(defaultValue?:Array<T>) {
  let newCollection:AtomCollection<T> = new AtomCollection(defaultValue);
  return newCollection;
}

export function computed<T = any>(store:AtomStore, func:Function) {
  let newComputed:AtomComputed<T> = new AtomComputed(store, func);
  return newComputed;
}

export function uid():AtomState<string> {
  let newUID:AtomState<string> = new AtomUID();
  return newUID;
}

export function store(newStore) {
  if (typeof newStore === "function") {
    let newStoreInstance = new newStore();
    if (newStoreInstance instanceof AtomStore) {
      newStoreInstance.init(newStoreInstance);
      return newStoreInstance;
    }
  } else {
    return new AtomStore(newStore);
  }
}

// TODO: find a way to make these functional component enabled features to work.

export function subscribe(target: any) {
  if(Array.isArray(target)) {
    target.forEach(state => subscribeSingle(state))
  } else if (target.subscribe){
    subscribeSingle(target);
  }
  
  return target;
}

function subscribeSingle(target: any){
  const [state, setState] = React.useState(Math.random())

  function updateState() {
    setState(Math.random())
  }

  React.useEffect(() => {
    target.subscribe(updateState)
    return () => target.unsubscribe(updateState)
  });
}

// export function useState<T = any>(value:any) { //TODO: Find a way to store state in useState scope
//   let state = new AtomState<T>(value);
//   // @ts-ignore
//   let functionalRender = React.useReducer(() => ({}))[1];
//   state.subscribe(functionalRender);
//   return state;
// }

export default {
  Store: AtomStore,
  // Component: AtomComponent,
  State: AtomState,
  UID: AtomUID,
  Computed: AtomComputed,
  Collection: AtomCollection,
  Boolean: AtomBoolean,
  String: AtomString,
  Number: AtomNumber,
  //Map: AtomMap, // TODO: map type
  //Array: AtomArray, // TODO: array type
};
