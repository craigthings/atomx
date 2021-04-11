import AtomState from './AtomState';
import AtomComputed from './AtomComputed';
import Events from './AtomEvents';
import AtomSubscriber from './AtomSubscriber';
import { Platforms } from './AtomSubscriber';
import AtomCollection from './AtomCollection';

type Constructor<T> = { new (): T }

export default class AtomStore extends AtomSubscriber {
    private computed:Array<AtomComputed<any>> = [];
    private initialized = false;
    private functional = false;
  
    constructor(stateValues?:Object) {
      super();
      if (stateValues) this.init(stateValues);
    }

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
  
    init = (stateValues?:Object) => {
      if (this.initialized === true) return this;
      if (stateValues) this.functional = true;
      if(!stateValues) stateValues = this;

      for (var key in stateValues) {
        let state = stateValues[key];
        // if (state instanceof AtomComputed) {
          // state.setParent(this);
          // if(!stateValues) this[key] = state;
          // this.computed.push(state);
          // state.init();
        // } else if (
          // state instanceof AtomState || 
          // state instanceof AtomCollection ||
          // state instanceof AtomComputed) {
            // this[key] = state;
        if( state instanceof AtomSubscriber) {
          state.on(Events.CHANGED, this.updateStore);
        }
      }
    };
  
    updateStore = (value) => {
      console.log('update store');
      // this.eventSubscribers.forEach((event) => {
      //   if (event.name === Events.CHANGED) {
      //     event.callback(this);
      //   }
      // });
      // this.subscribers.forEach((sub) => {
      //   sub.componentRef.forceUpdate();
      // });
      // this.updateComputed();
      this.update();
    };
  
    updateComputed = () => {
      console.log('update comp')
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
          value instanceof AtomState &&
          value instanceof AtomComputed === false
        ) {
          value.subscribe(renderFunction, scope, platform);
        }
      });
      return this;
    };
  }