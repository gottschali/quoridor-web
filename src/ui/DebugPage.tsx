import { GameController } from "./GameController";
import { RandomAgent } from "../agents/RandomAgent";
import { HumanAgent } from "../agents/HumanAgent";


export function DebugPage() {

    return GameController(HumanAgent, RandomAgent, 'observer');
}
