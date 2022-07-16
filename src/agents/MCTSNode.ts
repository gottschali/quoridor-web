import { Notation } from "../quoridor/Notation";
import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";
import { minMaxWrapper } from "./minMax";
import { shortestPathMove } from "./ShortestPathAgent";
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

    get UCT() {
        /*
         * Upper Confidence Bound for Trees
         * We may need to fine tune UCTparam
         */
        if (this.parent === null || this.parent.n === 0) {
            throw new Error("UCT called on root");
        } else if (this.n === 0) {
            return Number.POSITIVE_INFINITY;
        } else {
            return this.v / this.n + this.UCTparam * Math.sqrt(Math.log(this.parent.n) / this.n) ;
        }
    }

    bestChild(): MCTSNode {
        /*
         * Selects the child node with the highest UCT value
         */
        if (this.children.length === 0) {
            throw new Error("MCTSNode has no children");
        }
        let t = [this.children[0]];
        let m = t[0].UCT;
        for (const c of this.children) {
           if (c.UCT > m)  {
              m = c.UCT;
              t = [c];
           } else if (c.UCT === m) {
               t.push(c);
           }
        }
        return selectRandomly(t);
    }

    childWithMostVisits() {
        if (this.children.length === 0) {
            throw new Error("No children to choose from");
        }
        let index = 0;
        let maxVisits = this.children[0].n;
        for (let i = 1; i < this.children.length; i++) {
            if (this.children[i].n > maxVisits) {
                maxVisits = this.children[i].n;
                index = i;
            }
        }
        return this.children[index];
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get isTerminal() {
        if (this.state.isGameOver()) {
            return true;
        } else if (this.state.automaticPlayoutPossible) {
            return true;
        } else {
            return false;
        }
    }

    async rolloutPolicy(state: State): Promise<Notation> {
        return minMaxWrapper(state, 1, null, this.player);
    }

    async rollout(): Promise<number> {
        let currentState = this.state.clone();
        while (!currentState.isGameOver && !currentState.automaticPlayoutPossible) {
            // Heuristic from Gorisanon
            if (currentState.wallsAvailable[currentState.currentPlayer]) {
                const move = await shortestPathMove(currentState);
                currentState = currentState.makeMoveInplace(move);
            } else if (Math.random() < 0.7) {
                const move = await shortestPathMove(currentState);
                currentState = currentState.makeMoveInplace(move);
            } else {
                // TODO Choose a "probable" wall
                const  move = selectRandomly([...currentState.legalMoves]);
                currentState = currentState.makeMoveInplace(move);
            }
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

export class MCTSSearch {
    root: MCTSNode;

    constructor(state: State) {
        this.root = new MCTSNode(state, null, "ROOT", state.currentPlayer);
    }


    select() {
        let current: MCTSNode = this.root;
        while (!current.isTerminal) {
            if (!current.isFullyExpanded) {
                return current.expand();
            } else {
                current = current.bestChild();
            }
        }
        return current;
    }

    async bestAction(simulations=1000): Promise<Notation> {
        for (let i=0;i<simulations;i++) {
            const leaf = this.select();
            const reward = await leaf.rollout();
            leaf.backpropagate(reward);
        }
        const res = this.root.childWithMostVisits().move;
        return res;
    }
}
