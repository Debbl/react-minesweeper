import { BlockArea, GameStateRef } from "./types";
import { useState } from "react";
import Container from "./components/Container";
import MainContext from "./contexts/MainContext";
import { defaultBlockArea } from "@/constants/constants";
import { useRef } from "react";
import { initState } from "./utils/MainUtils";

function App() {
  const [isDev, setIsDev] = useState(false);
  const [blockArea, setBlockArea] = useState<BlockArea>(defaultBlockArea);
  const mineGeneratedRef = useRef(false);
  const gameStateRef = useRef<GameStateRef>(GameStateRef.play);
  const [state, setState] = useState(initState(blockArea));
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
        }}
      >
        <Container />
      </MainContext.Provider>
    </div>
  );
}
export default App;
