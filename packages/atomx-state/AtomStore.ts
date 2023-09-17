import AtomState from './AtomState';
import AtomComputed from './AtomComputed';
import AtomSubscriber from './AtomSubscriber';
import { Platforms } from './AtomSubscriber';
import AtomCollection from './AtomCollection';

type Constructor<T> = { new(): T }

export enum Events {
  CHANGED = "changed"
};

type FilteredState<T> = {
  [K in keyof T as T[K] extends AtomState<infer _> ? K : never]: T[K] extends AtomState<infer _>
    ? ReturnType<T[K]['get']>
    : never;
};

export default class AtomStore<T> extends AtomSubscriber {
  private initialized = false;
  // private computed:Array<AtomComputed<any>> = [];
  // private functional = false;

  constructor(stateValues?: Object) {
    super();
    if (stateValues) this.init(stateValues);
  }

  init = (stateValues?: Object) => {
    if (this.initialized === true) return this;
    // if (stateValues) this.functional = true;
    if (!stateValues) stateValues = this;

    for (var key in stateValues) {
      let state = stateValues[key];
      // if(this.functional) this[key] = state;
      if (state instanceof AtomSubscriber) {
        state.setParent(this);
        state.on(Events.CHANGED, this.updateStore);
      }
    }
    return this;
  };

  get(): FilteredState<T>{
    const result = {} as FilteredState<T>;
    for (const [key, val] of Object.entries(this)) {
      if (val instanceof AtomState) result[key as keyof typeof result] = val.get();
    }
    return result;
}

  set = (states: Partial<FilteredState<T>>) => {
    for (const [key, val] of Object.entries(states)) {
      if (this.hasOwnProperty(key)) {
        const state = this[key];
        if (state instanceof AtomState) state.set(val);
      } else {
        throw new Error(`Property ${key} does not exist on this AtomStore`);
      }
    }
  };

  reset = () => {
    for (let key in this) {
      let value = this[key];
      if (value instanceof AtomState) {
        value.reset();
      }
    }
  }

  updateStore = (/*value*/) => {
    this.update();
  };

  updateComputed = () => {
    // TODO: check this against how computeds already subscribe themselves, and run themselves. is this better?
    // this.computed.forEach((item) => {
    //   item.run(this);
    // });
  };

  on(eventName: string, handler: Function) {
    // TODO: make all interactions init this instance to avoid needing to init? might be unexpected behavior.
    // this.init(this);
    let keys = Object.keys(this);
    keys.forEach((key) => {
      let value = this[key];
      if (value instanceof AtomState) {
        value.on(eventName, handler);
      }
    });
  };

  off(eventName: string, handler: Function) {
    // this.init(this);
    let keys = Object.keys(this);
    keys.forEach((key) => {
      let value = this[key];
      if (value instanceof AtomState) {
        value.off(eventName, handler);
      }
    });
  };

  subscribe = (renderFunction: Function, scope: any, platform?: Platforms) => {
    // this.init(this);
    let keys = Object.keys(this);
    keys.forEach((key) => {
      let value = this[key];
      if (
        value instanceof AtomState ||
        value instanceof AtomCollection ||
        value instanceof AtomComputed
      ) {
        value.subscribe(renderFunction, scope, platform);
      }
    });
    return this;
  };

  unsubscribe = (renderFunction: Function) => {
    // this.init(this);
    let keys = Object.keys(this);
    keys.forEach((key) => {
      let value = this[key];
      if (
        value instanceof AtomState ||
        value instanceof AtomCollection || 
        value instanceof AtomComputed
      ) {
        value.unsubscribe(renderFunction);
      }
    });
    return this;
  };
}