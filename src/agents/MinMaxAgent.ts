import { Notation } from "../quoridor/Notation";
import { State } from "../quoridor/State";
 // eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./MinMaxWorker";
import { MachineAgent } from "./Agent";
import { shuffleArray } from "./utils";

export let nodes = 0;

let workers = new Array(navigator.hardwareConcurrency || 4).fill(null)
    .map(()=> new Worker());

export function MinMaxAgent(depth=5): MachineAgent {


    async function minMaxWrapper(state: State): Promise<Notation> {
        let start = performance.now();
        let alpha = Number.NEGATIVE_INFINITY;
        let beta = Number.POSITIVE_INFINITY;
        const kids = [...state.children.entries()];
        shuffleArray(kids);
        let t = Number.NEGATIVE_INFINITY;
        let tempMove = "";
        const promises = [];
        const n = kids.length;
        const workloads = [];
        // const workers = [new Worker(), new Worker(), new Worker(), new Worker()];
        for (let i=0;i<workers.length-1;i++) {
            workloads.push(kids.splice(0, n / workers.length));
        }
        workloads.push(kids);

        for (let i=0;i<workers.length;i++) {
            const worker = workers[i];
            const load = workloads[i];
            const data: [Notation, number][] = [];
            const p = new Promise<[Notation, number][]>(function(resolve) {
                // Reusing workers didnt work because onmessage was overwritten and promises were not resolved
                worker.onmessage = function(e: MessageEvent) {
                    data.push(e.data);
                    if (data.length === load.length) {
                        resolve(data);
                    }
                }
                for (const [move, child] of load) {
                    const stateNotation = child.toNotation();
                    worker.postMessage([move, stateNotation, state.settings, alpha, beta, state.currentPlayer, depth-1, false]);
                }
            })
            if (load.length) promises.push(p);
        }


        await Promise.all(promises)
        .then((data) => {
            console.log("All promises resolved, merging results", data);
            for (const part of data) {
                for (const d of part) {
                    const move = d[0];
                    const value = d[1];
                    if (value >= t) {
                        t = value;
                        tempMove = move;
                    }
                    alpha = Math.max(alpha, t)
                    // Problem: can't break out of the loop because we are in a callback function
                    // if (t >= beta) {
                    //     break loop;
                    // }
                }
            }
        });
        console.log(`Executed alpha-beta-min-max in ${performance.now() - start} ms`)
        return tempMove;
    }

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

    return {
        isMachine: true,
        name: 'MinMaxAgent',
        getMove: minMaxWrapper,
        terminate,
    }
}
