import AtomCollection from './AtomCollection';
import AtomComputed from './AtomComputed';
import AtomStore from './AtomStore';
import AtomState from './AtomState';
import AtomSubscriber from './AtomSubscriber';

import {
  AtomUID,
  AtomBoolean,
  AtomString,
  AtomNumber 
} from './AtomStateTypes';

type Constructor = new (...args: any[]) => {}

export function Subscriber<T extends Constructor>(Base: T) {
  return class extends Base {
    _subscribedStates:Array<AtomSubscriber> = [];
    _renderFunc:Function = () => {}

    constructor(...args: any[]){
      super(...args);

      if(this["forceUpdate"]) this._renderFunc = this["forceUpdate"];
      else if(this["render"]) this._renderFunc = this["render"]
      this._renderFunc.bind(this);
    }
  
    subscribe = (atomState:AtomSubscriber) => {
      let exists = this._subscribedStates.filter((item) => item === atomState).length > 0;
      if (exists === false) {
        this._subscribedStates.push(atomState);
      }
      let renderFunc:Function = () => {};
      atomState.subscribe(renderFunc, this);
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

// export function subscribe(atomValue) {
//   const api = {
//     forceUpdate: () => {}
//   };
//   api.forceUpdate = React.useReducer(() => ({}))[1];
//   atomValue.subscribe(api);
//   return api;
// }

// export function withAtomX() {
//   const api = {
//     forceUpdate: () => {},
//     subscribe: (atomValue) => {},
//   };
//   api.forceUpdate = React.useReducer(() => ({}))[1];
//   api.subscribe = function (atomValue) {
//     atomValue.subscribe(api);
//   };
//   return api;
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
