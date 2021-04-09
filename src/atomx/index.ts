import React from 'react';

import AtomCollection from './AtomCollection';
import AtomComputed from './AtomComputed';
import AtomStore from './AtomStore';
import AtomState from './AtomState';
import AtomComponent from './AtomComponent';

import {
  AtomUID,
  AtomBoolean,
  AtomString,
  AtomNumber 
} from './AtomStateTypes';

export function state<T>(...args) {
  let newState:AtomState<T> = new AtomState(...args);
  return newState;
}

export function collection<T>(...args) {
  let newCollection:AtomCollection<T> = new AtomCollection(...args);
  return newCollection;
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

export function subscribe(atomValue) {
  const api = {
    forceUpdate: () => {};
  };
  api.forceUpdate = React.useReducer(() => ({}))[1];
  atomValue.subscribe(api);
  return api;
}

export function withAtomX() {
  const api = {};
  api.forceUpdate = React.useReducer(() => ({}))[1];
  api.subscribe = function (atomValue) {
    atomValue.subscribe(api);
  };
  return api;
}

window.withAtomX = withAtomX;

export function computed(...args) {
  return new AtomComputed(...args);
}

// function newState<T>(value:T):AtomState<T>{
//   let state:AtomState<T> = new AtomState(value);
//   return state;
// }

// var a:newState<String> = newState('');

export default {
  Store: AtomStore,
  Component: AtomComponent,
  State: AtomState,
  UID: (...args) => {
    return new AtomUID(...args);
  },
  Computed: (...args) => {
    return new AtomComputed(...args);
  },
  Collection: (...args) => {
    return new AtomCollection(...args);
  },
  Boolean: (...args) => {
    return new AtomBoolean(...args);
  },
  String: (...args) => {
    return new AtomString(...args);
  },
  Number: (...args) => {
    return new AtomNumber(...args);
  },
};
