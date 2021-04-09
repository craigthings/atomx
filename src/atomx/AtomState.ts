import Events from './AtomEvents';
import AtomSubscriber from './AtomSubscriber';

class Subscriber {
  renderFunction: Function;

  constructor(renderFunction: Function) {
    this.renderFunction = renderFunction;
  }
}

export default class AtomState<T = any> extends AtomSubscriber {
  value: T;
  private defaultValue: T;

  constructor(defaultValue?:any) {
    super();
    this.value = defaultValue;
    this.defaultValue = defaultValue;
  }

  get = ():T => {
    return this.value;
  };

  set = (value: T) => {
    if (this.value === value) return;
    this.value = value;
    this.update();
    this.dispatch(Events.CHANGED);
  };

  reset = () => {
    this.set(this.defaultValue);
  }

  onChange = (callback: Function) => { this.on(Events.CHANGED, callback) }
}