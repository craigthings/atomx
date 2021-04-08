import Events from './AtomEvents';
import EventDispatcher from './EventDispatcher';

class Subscriber {
  renderFunction: Function;

  constructor(renderFunction: Function) {
    this.renderFunction = renderFunction;
  }
}

export default class AtomSubscriber extends EventDispatcher {
  subscribers: Array<Subscriber> = [];
  private disabled:Boolean = false;

  disable = () => {
    this.disabled = true;
  }

  enable = () => {
    this.disabled = false;
  }

  update = (event?:Events) => {
    if(this.disabled === true) return;
    this.subscribers.forEach((subscriber) => {
      subscriber.renderFunction();
    });
    if(event) this.dispatch(event, this);
    this.dispatch(Events.CHANGED, this);
  };
  
  subscribe = (renderFunction: Function | any) => {
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