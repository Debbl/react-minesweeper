import { BlockArea, GameStateRef } from "./types";
import { useState } from "react";
import Container from "./components/Container";
import MainContext from "./contexts/MainContext";
import { defaultBlockArea } from "@/constants/constants";
import { useRef } from "react";
import { initState } from "./utils/MainUtils";
import { useLocalStorageState } from "ahooks";

function App() {
  // 持久化
  const [gameState, setGameState] = useLocalStorageState("game-state", {
    defaultValue: {
      state: initState(defaultBlockArea),
      isDev: false,
      blockArea: defaultBlockArea,
      mineGeneratedRef: false,
      gameStateRef: GameStateRef.play,
    },
  });
  const [isDev, setIsDev] = useState(gameState.isDev);
  const [blockArea, setBlockArea] = useState<BlockArea>(gameState.blockArea);
  const [state, setState] = useState(gameState.state);
  const mineGeneratedRef = useRef(gameState.mineGeneratedRef);
  const gameStateRef = useRef<GameStateRef>(gameState.gameStateRef);

  return (
    <div className="box-border flex h-screen justify-center pt-[10%]">
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
      </MainContext.Provider>
    </div>
  );
}
export default App;
