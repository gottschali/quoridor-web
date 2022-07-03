import { Move } from "../quoridor/Move";

interface props {
    history: Move[],
    restoreHistory: (i: number) => void;
}
export function MoveHistory({history, restoreHistory}: props)  {

    return <ol>
                {history.map((move, i) => (
                    <li key={i} > <button onClick={() => restoreHistory(i)}> {JSON.stringify(move)} </button></li>
                ))}
            </ol>

}
