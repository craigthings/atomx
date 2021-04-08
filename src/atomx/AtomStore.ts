import AtomState from './AtomState';
import AtomComputed from './AtomComputed';
import Events from './AtomEvents';
import AtomSubscriber from './AtomSubscriber';

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
        if (state instanceof AtomComputed) {
          state.setStore(this);
          if(!stateValues) this[key] = state;
          this.computed.push(state);
          state.init();
        } else if (state instanceof AtomState) {
          this[key] = state;
          state.on(Events.CHANGED, this.updateStore);
        }
      }
    };
  
    updateStore = (value) => {
      // this.eventSubscribers.forEach((event) => {
      //   if (event.name === Events.CHANGED) {
      //     event.callback(this);
      //   }
      // });
      // this.subscribers.forEach((sub) => {
      //   sub.componentRef.forceUpdate();
      // });
      if (this.functional) this.updateComputed();
      this.update();
    };
  
    updateComputed = () => {
      // TODO: check this against how computeds already subscribe themselves, and run themselves. is this better?
      this.computed.forEach((item) => {
        item.run(this);
      });
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
  
    subscribe = (renderFunction:Function) => {
      // this.init(this);
      let keys = Object.keys(this);
      keys.forEach((key) => {
        let value = this[key];
        if (
          value instanceof AtomState &&
          value instanceof AtomComputed === false
        ) {
          value.subscribe(renderFunction);
        }
      });
      return this;
    };
  }