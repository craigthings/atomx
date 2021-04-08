import AtomState from './AtomState';
import AtomSubscriber from './AtomSubscriber';
import AtomStore from './AtomStore';
import Events from './AtomEvents';
import EventDispatcher from './EventDispatcher';

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

  add = (value: T) => {
    if (this.type && value instanceof this.type === false) {
      throw new Error(
        `AtomX: AtomCollection: Cannot set ${this.type.name} as ${typeof value}.`
      );
    }

    this.values.push(value);
    this.update(Events.ADDED);
  };

  new = (value: AtomStore | AtomState<T>) => {
    this.values.push(new this.type(value))
  }

  remove = (value:T) => {
    for (let i = 0; i < this.length; i++) {
      if (this.values[i] === value) {
        this.values.splice(i, 1);
      }
    }
    this.update(Events.REMOVED);
  };

  reset = () => {
    this.values = [ ... this.defaultValues ]
  }
}