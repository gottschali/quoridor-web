import { State } from "../quoridor/State";
 // eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./MinMaxWorker";
import { MachineAgent } from "./Agent";
import { minMaxWrapper } from "./minMax";
import { shortestPathMove } from "./ShortestPathAgent";

export let nodes = 0;

let workers = new Array(navigator.hardwareConcurrency || 4).fill(null)
    .map(()=> new Worker());

export function MinMaxAgent(depth=2): MachineAgent {

    function terminate() {
        for (const worker of workers) {
            worker.terminate();
        }
        workers = new Array(navigator.hardwareConcurrency || 4).fill(null)
            .map(()=> new Worker());
    }

    // const not = " i1 //a5 i5/9 10/1";
    // const s = State.fromNotation(not, {});
    // console.log(s.legalMoves);

    // const worker = new Worker();
    // worker.postMessage("Hello world");
    // console.log("Message posted");
    // worker.onmessage = function(e) {
    //     console.log('Message received from worker', e.data);
    // }
    function getMove(state: State) {
        if (state.wallsAvailable[state.currentPlayer] === 0) {
            return shortestPathMove(state);
        } else {
            return minMaxWrapper(state, depth, workers)
        }
    }

    return {
        isMachine: true,
        name: 'MinMaxAgent',
        getMove: getMove,
        terminate,
    }
}
