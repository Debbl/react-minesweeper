import { BlockArea, GameStateRef } from "./types";
import { useState } from "react";
import Container from "./components/Container";
import MainContext from "./contexts/MainContext";
import { defaultBlockArea } from "@/constants/constants";
import { useRef } from "react";
import { initState } from "./utils/MainUtils";
import { useLocalStorageState } from "ahooks";
import Footer from "./components/Footer";

function App() {
  // 持久化
  const [gameState, setGameState] = useLocalStorageState(
    "minesweeper-game-state",
    {
      defaultValue: {
        state: initState(defaultBlockArea),
        isDev: false,
        blockArea: defaultBlockArea,
        mineGeneratedRef: false,
        gameStateRef: GameStateRef.play,
      },
    },
  );
  const [isDev, setIsDev] = useState(gameState.isDev);
  const [blockArea, setBlockArea] = useState<BlockArea>(gameState.blockArea);
  const [state, setState] = useState(gameState.state);
  const mineGeneratedRef = useRef(gameState.mineGeneratedRef);
  const gameStateRef = useRef<GameStateRef>(gameState.gameStateRef);

  return (
    <div className="box-border flex h-screen flex-col items-center justify-start pt-[5%] font-sans dark:bg-slate-800 dark:text-white">
      <MainContext.Provider
        value={{
          state,
          setState,
          isDev,
          setIsDev,
          blockArea,
          setBlockArea,
          mineGeneratedRef,
          gameStateRef,
          setGameState,
        }}
      >
        <Container />
        <Footer />
      </MainContext.Provider>
    </div>
  );
}
export default App;
