import { GameController } from "./GameController";
import { RandomAgent } from "../agents/RandomAgent";
import { HumanAgent } from "../agents/HumanAgent";
import { GameSetup } from "./GameSetup";
import { Player } from "../quoridor/Player";
import { MinMaxAgent } from "../agents/MinMaxAgent";


export function DebugPage() {

    return (
        <div>
            <GameSetup />
            {GameController(HumanAgent, MinMaxAgent(1), Player.white)}
        </div>
    )
}
