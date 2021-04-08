import React from "react";
import AtomState from "./AtomState";
import AtomSubscriber from "./AtomSubscriber";

interface Props extends React.HTMLAttributes<any> {}

export default class AtomComponent<T, K extends keyof Props> extends React.Component<Props> {
  private subscribedStates:Array<AtomSubscriber> = [];

  constructor(props:Props) {
    super(props);
  }

  subscribe = (atomState:AtomSubscriber) => {
    let exists = this.subscribedStates.filter((item) => item === atomState).length > 0;
    if (exists === false) {
      this.subscribedStates.push(atomState);
    }
    atomState.subscribe(this.forceUpdate);
  };

  unsubscribe = (atomState:AtomSubscriber) => {
    this.subscribedStates
      .filter((subscribedAtomState) => subscribedAtomState === atomState)
      .forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this.forceUpdate));
  };

  unsubscribeAll = () => {
    this.subscribedStates.forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this.forceUpdate));
  };
}