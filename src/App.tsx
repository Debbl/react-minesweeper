import { BlockArea, GameStateRef } from "./types";
import { useState } from "react";
import Container from "./components/Container";
import MainContext from "./contexts/MainContext";
import { BLOCK_AREA } from "@/constants/constants";
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
        state: initState(BLOCK_AREA),
        isDev: false,
        mines: 3,
        blockArea: BLOCK_AREA,
        mineGeneratedRef: false,
        gameStateRef: GameStateRef.play,
      },
    },
  );
  const [isDev, setIsDev] = useState(gameState.isDev);
  const [blockArea, setBlockArea] = useState<BlockArea>(gameState.blockArea);
  const [state, setState] = useState(gameState.state);
  const [mines, setMines] = useState(gameState.mines);
  const mineGeneratedRef = useRef(gameState.mineGeneratedRef);
  const gameStateRef = useRef<GameStateRef>(gameState.gameStateRef);

  return (
    <div className="h-screen overflow-auto py-[5%] text-center font-sans dark:bg-slate-800 dark:text-white">
      <MainContext.Provider
        value={{
          state,
          setState,
          isDev,
          setIsDev,
          mines,
          setMines,
          blockArea,
          setBlockArea,
          mineGeneratedRef,
          gameStateRef,
          setGameState,
        }}
      >
        <div className="inline-block">
          <Container />
          <Footer />
        </div>
      </MainContext.Provider>
    </div>
  );
}
export default App;
