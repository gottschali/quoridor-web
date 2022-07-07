import { ListItem, OrderedList } from "@chakra-ui/react";
import { Notation } from "../quoridor/Notation";

interface props {
    history: Notation[],
    restoreHistory: (i: number) => void;
}
export function MoveHistory({history, restoreHistory}: props)  {

    return <OrderedList>
                {history.map((move, i) => (
                    <ListItem key={i}>
                        <button onClick={() => restoreHistory(i)}>
                            {move}
                        </button
                    ></ListItem>
                ))}
            </OrderedList>

}
