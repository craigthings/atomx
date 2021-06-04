import AtomState from './AtomState';
import AtomComputed from './AtomComputed';
import AtomSubscriber from './AtomSubscriber';
import { Platforms } from './AtomSubscriber';
import AtomCollection from './AtomCollection';

type Constructor<T> = { new(): T }

export enum Events {
  CHANGED = "changed"
};

type UnwrapState<S> = S extends AtomState<infer T>
  ? T : S extends AtomComputed<infer T>
  ? T : S extends AtomCollection<infer T>
  ? T : never;

// type for not filtering any types out.
// type UnwrapStateOrPassthrough<S> = S extends AtomState<infer T> ? T : S;

type StateKeys<T> = {
  [P in keyof T]: T[P] extends AtomState<infer _>
  ? P : T[P] extends AtomComputed<infer _>
  ? P : T[P] extends AtomCollection<infer _>
  ? P : never;
}[keyof T];

type UnwrapStateProperties<S> = {
  [Property in StateKeys<S>]: UnwrapState<S[Property]>;
};

export default class AtomStore extends AtomSubscriber {
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

  get = (): UnwrapStateProperties<this> => {
    let instance = this;
    let items: [string, typeof AtomSubscriber][] = Object.entries(instance)
      .filter(([key, value]) => {
        return value instanceof AtomState ||
          value instanceof AtomCollection ||
          value instanceof AtomComputed;
      })
      .map(([key, value]) => {
        return [key, value.get()];
      });

    return Object.fromEntries(items) as UnwrapStateProperties<this>;
  };

  set = (states: UnwrapStateProperties<this> | {}) => {
    let instance = this;
    for (let key in Object(states)) {
      let value = Object(states)[key];
      if (
        Object(instance)[key] &&
        (Object(instance)[key] instanceof AtomState ||
          Object(instance)[key] instanceof AtomCollection ||
          Object(instance)[key] instanceof AtomComputed)
      ) {
        Object(instance)[key].set(value);
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