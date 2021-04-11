import React from "react";
import AtomState from "../atomx/AtomState";
import AtomSubscriber from "../atomx/AtomSubscriber";
import { Platforms } from "../atomx/AtomSubscriber";

// interface Props extends HTMLElement {}

export default class AtomComponent<T = {}, K = {}> extends React.Component<T, K> {
  private subscribedStates: Array<AtomSubscriber> = [];

  constructor(props: T) {
    super(props);
  }

  subscribe = (atomState: AtomSubscriber) => {
    let exists = this.subscribedStates.filter((item) => item === atomState).length > 0;
    if (exists === false) {
      this.subscribedStates.push(atomState);
    }
    atomState.subscribe(this.forceUpdate, this, Platforms.React);
  };

  unsubscribe = (atomState: AtomSubscriber) => {
    this.subscribedStates
      .filter((subscribedAtomState) => subscribedAtomState === atomState)
      .forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this.forceUpdate));
  };

  unsubscribeAll = () => {
    this.subscribedStates.forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this.forceUpdate));
  };
}

// TODO: Really good way to add html attributes to react component
// interface Props extends React.HTMLProps<{}> {
//   test: Boolean;
// }