import { Move } from "../quoridor/Move";

interface props {
    history: Move[],
}
export function MoveHistory({history}: props)  {

    return <ol>
                {history.map((move, i) => (
                    <li key={i}> <a> {JSON.stringify(move)} </a></li>
                ))}
            </ol>

}
