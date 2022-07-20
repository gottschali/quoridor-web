import { State } from "../quoridor/State";
import { MCTSSearch } from "./MCTSNode";
import { minMax } from "./minMax";

/*
 * Wepback complains if we try to use different Workers.
 * To circumvent this issue we pass an event type as the first element in the data array
 * and perform the work depending on that value.
 */
export enum workTypes {
    MINMAX = "MINMAX",
    MCTS = "MCTS",
}

onmessage = async function(e) {
    switch (e.data[0]) {
        case workTypes.MINMAX:
            minMaxWorker(e.data.splice(1));
            break;
        case workTypes.MCTS:
            mctsWorker(e.data.splice(1));
            break;
        default:
            break;
    }
}

async function mctsWorker(data: any) {
  const [stateNotation, settings, simulations] = data;
    console.log("received", data)
  try {
    const state = State.fromNotation(stateNotation, settings);
    const search = new MCTSSearch(state)
    const move = await search.bestAction(simulations);
    console.log("sent", [move])
    postMessage([move]);
  } catch (e) {
    console.error(e, stateNotation);
  }
}
function minMaxWorker(data: any) {
  const [move, stateNotation, settings, alpha, beta, maxPlayer, depth, maximizing] = data;
  try {
    const state = State.fromNotation(stateNotation, settings);
    const value = minMax({state, alpha, beta, maxPlayer, depth, maximizing});
    postMessage([move, value]);
  } catch (e) {
    console.error(e, stateNotation);
  }
}

