import { GameController } from "./GameController";
import { RandomAgent } from "../agents/RandomAgent";
import { HumanAgent } from "../agents/HumanAgent";
import { agentList, Agents, GameSetup } from "./GameSetup";
import { Player } from "../quoridor/Player";
import { MinMaxAgent } from "../agents/MinMaxAgent";
import { useEffect, useState } from "react";


export function DebugPage() {
    /*     const [gc, setGc] = useState(GameController(HumanAgent, MinMaxAgent(1), Player.white)); */


    return (
        <div>
            <GameController />
            {/*             {GameController(agentList[whiteAgent], agentList[blackAgent], 'gray')} */}
        </div>
    )
}
