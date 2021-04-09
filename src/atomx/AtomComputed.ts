import AtomState from './AtomState';
import Events from './AtomEvents';
import AtomStore from './AtomStore';

export default class AtomComputed<T> extends AtomState<T> {
  private func: Function = function () { };
  private store: AtomStore;
  private initialized: Boolean = false;

  constructor(store: AtomStore, func: Function) {
    super();
    this.func = func;
    this.store = store;
    this.init();
  }

  init = () => {
    // TODO: check if this is necessary since store already fires RUN when and values there change.
    // this.initialized = true;
    // this.value = this.func(this.store);
    // for (let key in this.store) {
    //   let value = this.store[key];
    //   if (value instanceof AtomComputed) {
    //     value.on(Events.CHANGED, this.run);
    //   } else if (value instanceof AtomState) {
    //     value.on(Events.CHANGED, this.run);
    //   }
    // }
  };

  setStore = (store) => {
    this.store = store;
  }

  run = (store?: AtomStore) => {
    if (!store) store = this.store;

    let newValue = this.func(store);
    if (newValue !== this.value) this.set(newValue);
  };
}
var store:AtomStore = new AtomStore();
var a:AtomComputed<Boolean> = new AtomComputed(store, ():Boolean => {
  return false;
});