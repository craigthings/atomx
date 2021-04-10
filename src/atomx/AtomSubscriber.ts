import Events from './AtomEvents';
import EventDispatcher from './EventDispatcher';

export enum Platforms {
  None = 'none',
  React = 'react'
}

class Subscriber {
  renderFunction: Function;
  scope: any;
  platform: Platforms;

  constructor(renderFunction: Function, scope:any, platform?:Platforms) {
    this.renderFunction = renderFunction;
    this.scope = scope;
    platform ? this.platform = platform : this.platform = Platforms.None;
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
      let isReactRender = subscriber.platform === Platforms.React;
      if(isReactRender) subscriber.renderFunction.call(subscriber.scope);
      else subscriber.renderFunction.call(subscriber.scope, this);
    });
    if(event) this.dispatch(event, this);
    this.dispatch(Events.CHANGED, this);
  };
  
  subscribe = (renderFunction: Function, scope?:any, platform?:Platforms) => {
    if (!renderFunction) throw new Error("AtomX Error: Render function missing.");
    let exists = this.subscribers.filter((subscriber) => subscriber.renderFunction === renderFunction).length > 0;
    if (exists === false) {
      this.subscribers.push(new Subscriber(renderFunction, scope, platform));
    }
    return this;
  };
  
  unsubscribe = (renderFunction: Function) => {
    if (!renderFunction) throw new Error("AtomX Error: Render function missing.");
    let renderFunctionIndex = this.subscribers.findIndex((subscriber) => subscriber.renderFunction === renderFunction);
    this.subscribers.splice(renderFunctionIndex, 1);
  };
}