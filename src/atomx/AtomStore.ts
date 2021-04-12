import AtomState from './AtomState';
import AtomComputed from './AtomComputed';
import Events from './AtomEvents';
import AtomSubscriber from './AtomSubscriber';
import { Platforms } from './AtomSubscriber';
import AtomCollection from './AtomCollection';

type Constructor<T> = { new (): T }

export default class AtomStore extends AtomSubscriber {
  private initialized = false;
    // private computed:Array<AtomComputed<any>> = [];
    // private functional = false;
  
    constructor(stateValues?:Object) {
      super();
      if (stateValues) this.init(stateValues);
    }

    init = (stateValues?:Object) => {
      if (this.initialized === true) return this;
      // if (stateValues) this.functional = true;
      if(!stateValues) stateValues = this;

      for (var key in stateValues) {
        let state = stateValues[key];
        // if(this.functional) this[key] = state;
        if( state instanceof AtomSubscriber) {
          state.setParent(this);
          state.on(Events.CHANGED, this.updateStore);
        }
      }
      return this;
    };

    set = (values:any) => {
      for (let key in this) {
        let value = this[key];
        if (value instanceof AtomState && values.hasOwnProperty(key)) {
          value.set(values[key]);
        }
      }
    }

    get = () => {
      // TODO: make this work with auto complete with some sort of typing setup.
      let dataObject:any = {};
      for (let key in this) {
        let value:any = this[key];
        if (value instanceof AtomState) {
          dataObject[key] = value.get();
        }
      }
      return dataObject;
    }

    reset = () => {
      for (let key in this) {
        let value = this[key];
        if (value instanceof AtomState) {
          value.reset();
        }
      }
    }

    updateStore = (value) => {
      this.update();
    };
  
    updateComputed = () => {
      // TODO: check this against how computeds already subscribe themselves, and run themselves. is this better?
      // this.computed.forEach((item) => {
      //   item.run(this);
      // });
    };
  
    on(eventName:string, handler:Function) {
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

    off(eventName:string, handler:Function) {
      // this.init(this);
      let keys = Object.keys(this);
      keys.forEach((key) => {
        let value = this[key];
        if (value instanceof AtomState) {
          value.off(eventName, handler);
        }
      });
    };
  
    subscribe = (renderFunction:Function, scope:any, platform?:Platforms) => {
      // this.init(this);
      let keys = Object.keys(this);
      keys.forEach((key) => {
        let value = this[key];
        if (
          value instanceof AtomState ||
          value instanceof AtomCollection
        ) {
          value.subscribe(renderFunction, scope, platform);
        }
      });
      return this;
    };

    unsubscribe = (renderFunction:Function) => {
      // this.init(this);
      let keys = Object.keys(this);
      keys.forEach((key) => {
        let value = this[key];
        if (
          value instanceof AtomState ||
          value instanceof AtomCollection
        ) {
          value.unsubscribe(renderFunction);
        }
      });
      return this;
    };
  }