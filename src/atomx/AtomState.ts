import AtomCollection from './AtomCollection';
import Events from './AtomEvents';
import AtomStore from './AtomStore';
import AtomSubscriber from './AtomSubscriber';

class Subscriber {
  renderFunction: Function;

  constructor(renderFunction: Function) {
    this.renderFunction = renderFunction;
  }
}

export default class AtomState<T = any> extends AtomSubscriber {
  value: T;
  _parent: any = null;
  private defaultValue: T;
  // TODO: need to properly set _parent type

  constructor(defaultValue?:any) {
    super();
    this.value = defaultValue;
    this.defaultValue = defaultValue;
  }

  get = ():T => {
    return this.value;
  };

  set = (value: T):AtomState => {
    if (this.value === value) return this;
    this.value = value;
    this.update();
    this.dispatch(Events.CHANGED);
    return this;
  };

  reset = () => {
    this.set(this.defaultValue);
    return this;
  }

  _setParent = (parent: AtomStore | AtomCollection<T>) => {
    this._parent = parent;
  }

  onChange = (callback: Function) => { this.on(Events.CHANGED, callback) }
}