import Events from './AtomEvents';
import EventDispatcher from './EventDispatcher';

class Subscriber {
  renderFunction: Function;

  constructor(renderFunction: Function) {
    this.renderFunction = renderFunction;
  }
}

export default class AtomState<T> extends EventDispatcher {
  events = Events;
  subscribers: Array<Subscriber> = [];
  eventSubscribers = [];
  value: T | any;
  private defaultValue: T;

  constructor(defaultValue?:T | any) {
    super();
    this.value = defaultValue;
    this.defaultValue = defaultValue;
  }

  get = () => {
    return this.value;
  };

  set = (value: T | any) => {
    if (this.value === value) return;
    this.value = value;
    this.update();
    this.dispatch(Events.CHANGE);
  };

  reset = () => {
    this.set(this.defaultValue);
  }

  onChange = (callback: Function) => { this.on(Events.CHANGE, callback) }

  update = (event?:Events) => {
    this.subscribers.forEach((subscriber) => {
      subscriber.renderFunction();
    });
    if(event) this.dispatch(event, this);
    this.dispatch(Events.CHANGE, this);
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