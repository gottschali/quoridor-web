import { Player } from "../quoridor/Player";
import { State } from "../quoridor/State";


export function evaluateState(state: State, evalPlayer: Player) {
  // (already computed) Perform BFS for both pawns to get distance to finishline
  const d1 = state.shortestPaths[evalPlayer];
  const otherPlayer = evalPlayer === Player.white ? Player.black : Player.white;
  const d2 = state.shortestPaths[otherPlayer];
  if (state.wallsAvailable[0] + state.wallsAvailable[1] === 0) {
    // The one with shorter distance wins
    // But check if a jump could influence it!
    // TODO: do it correctly with taking account for jumps
    // jumps should not be a problem if difference bigger than 1
    // or the distance to the enemy pawn is farther than to the end
    // Wait: we can just play it out
  }
  // factor in the walls available
  return d2 - d1 + 0 * state.wallsAvailable[evalPlayer] - 0 * state.wallsAvailable[otherPlayer] + Math.random();
  // return (30-d1) + d2 + 10 +  Math.random() * 5;
}
