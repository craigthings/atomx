import AtomState from './AtomState';
import Events from './AtomEvents';
import AtomStore from './AtomStore';

export default class AtomComputed<T> extends AtomState<T> {
  private func: Function = function () { };
  private parent: any;
  private initialized: Boolean = false;

  constructor(parent: any, func: Function) {
    super();
    this.func = func;
    this.parent = parent;
    this.init();
  }

  init = () => {
    // TODO: check if this is necessary since store already fires RUN when and values there change.
    this.initialized = true;
    this.value = this.func(this.parent);
    for (let key in this.parent) {
      let value = this.parent[key];
      if (value instanceof AtomComputed) {
        value.on(Events.CHANGED, this.run);
      } else if (value instanceof AtomState) {
        value.on(Events.CHANGED, this.run);
      }
    }
  };

  setParent = (parent:any) => {
    this.parent = parent;
  }

  run = (parent?: any) => {
    if (!parent) parent = this.parent;

    let newValue = this.func(parent);
    if (newValue !== this.value) this.set(newValue);
  };
}