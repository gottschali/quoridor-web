import { State } from "../quoridor/State";
import { minMax } from "./minMax";

// eslint-disable-next-line no-restricted-globals
const ctx: Worker = self as any;


onmessage = function(e) {
  const [move, stateNotation, settings, alpha, beta, maxPlayer, depth, maximizing] = e.data;
  try {
    const state = State.fromNotation(stateNotation, settings);
    const value = minMax({state, alpha, beta, maxPlayer, depth, maximizing});
    // ctx.postMessage(value);
    postMessage([move, value]);
  } catch (e) {
    console.error(e, stateNotation);
  }
}


export {};
