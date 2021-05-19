import AtomState from './AtomState';
import AtomSubscriber from './AtomSubscriber';
import AtomStore from './AtomStore';

export enum Events {
  CHANGED = "changed",
  ADDED = "added",
  REMOVED = "removed",
};

export default class AtomCollection<T> extends AtomSubscriber {
  type:any;
  values: Array<T> = [];
  private defaultValues: Array<T> = [];
  //private defaultArgs = [];

  constructor(values?:Array<T>, type?:T, ...args: any) {
    super();
    if (type) this.type = type;
    if(values) {
      for(let value of values){
        if(value instanceof AtomState === false) continue;
        this.values.push(value);
      }
    }
  }

  set = (values:Array<T>) => {
    values.forEach(value => {
      this.values.push(value);
    })
  }

  get = ():Array<T> => {
    return [ ... this.values ];
  }

  get length():number {
    return this.values.length;
  }
  // TODO: add option to disable tracking changes on children
  add = (value: T | any) => {
    if (this.type && value instanceof this.type === false) {
      throw new Error(
        `AtomX: AtomCollection: Cannot set ${this.type.name} as ${typeof value}.`
      );
    }

    value.on(Events.CHANGED, this.handleChildUpdate);
    value.parent = this;

    this.values.push(value);
    this.update(Events.ADDED);
  };
  // TODO: this should return the whole store, not just the individual state that was changed.
  handleChildUpdate = (e:T | any) => {
    this.dispatch(Events.CHANGED, e);
  }

  new = (value: AtomStore | AtomState<T>) => {
    this.values.push(new this.type(value))
  }

  remove = (value:T | any) => {
    for (let i = 0; i < this.length; i++) {
      if (this.values[i] === value) {
        this.values.splice(i, 1);
      }
    }
    value.off(Events.CHANGED, this.handleChildUpdate);
    this.update(Events.REMOVED);
  };

  reset = () => {
    this.values = [ ... this.defaultValues ]
  }

  onAdded = (callback: Function) => { this.on(Events.ADDED, callback) }
  onRemoved = (callback: Function) => { this.on(Events.REMOVED, callback) }
}