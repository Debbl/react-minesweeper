import { GameState, PlayState } from "./types";
import Container from "./components/Container";
import MainContext from "./contexts/MainContext";
import { defaultBlockArea } from "@/constants/constants";
import { initState } from "./utils/MainUtils";
import { useLocalStorageState } from "ahooks";

function App() {
  const [gameState, setGameState] = useLocalStorageState<GameState>(
    "game-state",
    {
      defaultValue: {
        state: initState({ width: 5, height: 5 }),
        isDev: false,
        blockArea: defaultBlockArea,
        mineGenerated: false,
        playState: PlayState.play,
      },
    },
  );
  return (
    <div className="box-border flex h-screen justify-center pt-[10%]">
      <MainContext.Provider value={{ gameState, setGameState }}>
        <Container />
      </MainContext.Provider>
    </div>
  );
}
export default App;
