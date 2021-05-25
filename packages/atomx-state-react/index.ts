// import AtomSubscriber from '../atomx-state/AtomSubscriber';
import { useState, useEffect } from 'react'

export function subscribe(...args:any[]) { // 'any[]' is likely to be AtomSubscriber[]
  // TODO: check if any[] is an AtomSubscriber.
  let states:any[] = args.map(state => state['get']())
  const [state, setState] = useState([ ... states ])

  function updateState() {
    let states:any[] = args.map(state => state['get']())
    setState([ ... states ])
  }
  
  useEffect(() => {
    args.forEach(state => state.subscribe(updateState))
    return () => args.forEach(state => state.unsubscribe(updateState))
  });

  return args;
}

// export function useState<T = any>(value:any) { //TODO: Find a way to store state in useState scope
//   let state = new AtomState<T>(value);
//   // @ts-ignore
//   let functionalRender = React.useReducer(() => ({}))[1];
//   state.subscribe(functionalRender);
//   return state;
// }