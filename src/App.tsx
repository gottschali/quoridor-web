import './App.css';
import {DebugPage} from './ui/DebugPage';
import {Text} from "@chakra-ui/react";
import { CookiesProvider } from "react-cookie";

function App() {
  return (
    <CookiesProvider>
    <div className="App">
        <Text
          fontSize="6xl"
          fontWeight="extrabold"
        >
          Quoridor
        </Text>
        <DebugPage />
    </div>
    </CookiesProvider>
  );
}

export default App;
