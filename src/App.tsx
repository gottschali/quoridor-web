import './App.css';
import {DebugPage} from './ui/DebugPage';
import {Text} from "@chakra-ui/react";

function App() {
  return (
    <div className="App">
        <Text
          fontSize="6xl"
          fontWeight="extrabold"
        >
          Quoridor
        </Text>
        <DebugPage />
    </div>
  );
}

export default App;
