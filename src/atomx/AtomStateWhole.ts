import Events from './AtomEvents';
import EventDispatcher from './EventDispatcher';

class Subscriber {
  renderFunction: Function;

  constructor(renderFunction: Function) {
    this.renderFunction = renderFunction;
  }
}

export default class AtomState<T> extends EventDispatcher {
  subscribers: Array<Subscriber> = [];
  value: T;
  private disabled:Boolean = false;
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

  disable = () => {
    this.disabled = true;
  }

  enable = () => {
    this.disabled = false;
  }

  onChange = (callback: Function) => { this.on(Events.CHANGED, callback) }

  update = (event?:Events) => {
    if(this.disabled === true) return;
    this.subscribers.forEach((subscriber) => {
      subscriber.renderFunction();
    });
    if(event) this.dispatch(event, this);
    this.dispatch(Events.CHANGED, this);
  };

  subscribe = (renderFunction: Function) => {
    if (!renderFunction) throw new Error("AtomX Error: Render function missing.");
    let exists = this.subscribers.filter((subscriber) => subscriber.renderFunction === renderFunction).length > 0;
    if (exists === false) {
      this.subscribers.push(new Subscriber(renderFunction));
    }
    return this;
  };

  unsubscribe = (renderFunction: Function) => {
    if (!renderFunction) throw new Error("AtomX Error: Render function missing.");
    let renderFunctionIndex = this.subscribers.findIndex((subscriber) => subscriber.renderFunction === renderFunction);
    this.subscribers.splice(renderFunctionIndex, 1);
  };
}