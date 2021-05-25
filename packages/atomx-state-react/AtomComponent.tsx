// TODO: Decide if this is useful for anyone.
// import React from "react";
// import AtomState from "../atomx-state/AtomState";
// import AtomSubscriber from "../atomx-state/AtomSubscriber";
// import { Platforms } from "../atomx-state/AtomSubscriber";

// // interface Props extends HTMLElement {}

// export default class AtomComponent<T = {}, K = {}> extends React.Component<T, K> {
//   private subscribedStates: Array<AtomSubscriber> = [];

//   constructor(props: T) {
//     super(props);
//   }

//   subscribe = (atomState: AtomSubscriber) => {
//     let exists = this.subscribedStates.filter((item) => item === atomState).length > 0;
//     if (exists === false) {
//       this.subscribedStates.push(atomState);
//     }
//     atomState.subscribe(this.forceUpdate, this, Platforms.React);
//   };

//   unsubscribe = (atomState: AtomSubscriber) => {
//     this.subscribedStates
//       .filter((subscribedAtomState) => subscribedAtomState === atomState)
//       .forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this.forceUpdate));
//   };

//   unsubscribeAll = () => {
//     this.subscribedStates.forEach((subscribedAtomState) => subscribedAtomState.unsubscribe(this.forceUpdate));
//   };
// }

// // TODO: Saving this slick way to add html attributes to react components
// // interface Props extends React.HTMLProps<{}> {
// //   test: Boolean;
// // }