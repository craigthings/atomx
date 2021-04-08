import AtomState from './AtomState';
import Events from './AtomEvents';

export default class AtomComputed extends AtomState {
    #func = function () { };
    #store = undefined;
    #initialized = false;
  
    constructor(store, func) {
      super();
      this.#func = func;
      this.#store = store;
      this.init();
    }
  
    init = () => {
      this.#initialized = true;
      this.value = this.#func(this.#store);
      for (let key in this.#store) {
        let value = this.#store[key];
        if (value instanceof AtomComputed) {
          value.on(Events.CHANGE, this.run);
        } else if (value instanceof AtomState) {
          value.on(Events.CHANGE, this.run);
        }
      }
    };
  
    get = () => {
      return this.value;
    };
  
    run = () => {
      let newValue = this.#func(this.#store);
      if (newValue !== this.value) this.set(newValue);
    };
  }