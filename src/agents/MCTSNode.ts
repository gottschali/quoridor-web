import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";
import { selectRandomly } from "./utils";

export class MCTSNode {
    state: State;
    n: number = 0; // number of visits
    v: number = 0; // value of the node
    parent: MCTSNode | null;
    children: MCTSNode[] = [];
    untriedActions: Notation[];
    move: Notation;
    UCTparam = Math.sqrt(2);
    player: Player;

    constructor(state: State, parent: MCTSNode | null, move: Notation, player: Player) {
        this.state = state;
        this.parent = parent;
        this.untriedActions = [...state.legalMoves];
        this.move = move;
        this.player = player;
    }

    expand() {
        const move = this.untriedActions.pop();
        if (!move) {
            throw new Error("Node is already fully expanded");
        }
        const nextState = this.state.makeMove(move);
        const childNode = new MCTSNode(nextState, this, move, this.player);
        this.children.push(childNode);
        return childNode;
    }
    get isFullyExpanded() {
        return this.untriedActions.length === 0;
    }

    select() {
        let current: MCTSNode = this;
        while (!current.isTerminal) {
            if (!current.isFullyExpanded) {
                return current.expand();
            } else {
                current = current.bestChild();
            }
        }
        return current;
    }

    bestAction(simulations=100): Notation {
        for (let i=0;i<simulations;i++) {
            const leaf = this.select();
            const reward = leaf.rollout();
            leaf.backpropagate(reward);
        }
        return this.bestChild().move;
    }

    get UCT() {
        if (this.parent === null) {
            throw new Error("UCT called on root");
        }
       return this.v / this.n + this.UCTparam * Math.sqrt(Math.log(this.parent.n / this.n)) ;
    }

    bestChild(): MCTSNode {
        let t = this.children[0];
        let m = t.UCT;
        for (const c of this.children) {
           if (c.UCT > m)  {
              m = c.UCT;
            t = c;
           }
        }
        return t;
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get isTerminal() {
        if (this.state.isGameOver()) {
            return true;
        }
        if (this.state.automaticPlayoutPossible) {
            return true;
        } else {
            return false;
        }
    }

    rolloutPolicy(moves: Notation[]) {
        return selectRandomly(moves);
    }

    rollout(): number {
        let currentState = this.state;
        while (!currentState.isGameOver && !currentState.automaticPlayoutPossible) {
            const possibleMoves = currentState.legalMoves;
            const move = this.rolloutPolicy([...possibleMoves]);
            currentState = currentState.makeMove(move);
        }
        return currentState.result(this.player);
    }
    backpropagate(result: number) {
        this.n++;
        this.v += result;
        if (this.parent !== null) {
            this.parent.backpropagate(result);
        }
    }
}
