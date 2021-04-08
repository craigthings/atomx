import AtomState from './AtomState';
import AtomComputed from './AtomComputed';
import Events from './AtomEvents';

export default class AtomStore extends AtomState {
    private computed = [];
    private initialized = false;
    private functional = false;
    private disabled = false;
    allValues = [];
  
    constructor(valueSet) {
      super();
      if (valueSet) this.init(valueSet);
    }
  
    disable = () => {
      this.disabled = true;
    };
  
    enable = () => {
      this.allValues.forEach(value => {
  
      });
    };

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
  
    init = (valueSet) => {
      if (this.initialized === true) return this;
      if (!valueSet) {
        for (let key in this) {
          let value = this[key];
          if (value instanceof AtomComputed) {
            value.store = this;
            this.computed.push(value);
            value.init();
          } else if (value instanceof AtomState) {
            this[key] = value;
            value.on(Events.CHANGE, this.updateStore);
            // value.on(Events.CHANGE, this.updateComputed);
          }
        }
      } else {
        this.functional = true;
        for (var key in valueSet) {
          let value = valueSet[key];
          if (value instanceof AtomComputed) {
            value.store = this;
            this[key] = value;
            this.computed.push(value);
            value.init();
          } else if (value instanceof AtomState) {
            this[key] = value;
            value.on(Events.CHANGE, this.updateStore);
            // value.on(Events.CHANGE, this.updateComputed);
          }
        }
      }
      this.initialized = true;
      return this;
    };
  
    updateStore = (value) => {
      this.eventSubscribers.forEach((event) => {
        if (event.name === Events.CHANGE) {
          event.callback(this);
        }
      });
      this.subscribers.forEach((sub) => {
        sub.componentRef.forceUpdate();
      });
      if (this.functional) this.updateComputed(value);
      // console.log(this.subscribers);
      this.update();
    };
  
    updateComputed = (value) => {
      this.computed.forEach((item) => {
        item.run(this);
      });
    };
  
    on = (...args) => {
      this.init(this);
      let keys = Object.keys(this);
      keys.forEach((key) => {
        let value = this[key];
        if (value instanceof AtomState) {
          value.on(...args);
        }
      });
    };
  
    subscribe = (component) => {
      // this.init(this);
      let keys = Object.keys(this);
      keys.forEach((key) => {
        let value = this[key];
        if (
          value instanceof AtomState &&
          value instanceof AtomComputed === false
        ) {
          value.subscribe(component);
        }
      });
    };
  }