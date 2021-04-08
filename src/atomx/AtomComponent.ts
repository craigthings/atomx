import React from "react";
import AtomState from "./AtomState";

interface Props extends React.HTMLAttributes<any> {}

export default class AtomComponent extends React.Component<Props> {
  private subscribedStates:Array<AtomState<any>> = [];

  constructor(props:Props) {
    super(props);
  }

  subscribe = (atomState:AtomState<any>) => {
    let exists = this.subscribedStates.filter((item) => item === atomState).length > 0;
    if (exists === false) {
      this.subscribedStates.push(atomState);
    }
    atomState.subscribe(this.forceUpdate);
  };

  unsubscribe = (atomState:AtomState<any>) => {
    this.subscribedStates
      .filter((subscribedAtomState) => subscribedAtomState === atomState)
      .forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this.forceUpdate));
  };

  unsubscribeAll = () => {
    this.subscribedStates.forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this.forceUpdate));
  };
}