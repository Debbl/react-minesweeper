import { GameState, GameStateRef } from "@/types";
import { createContext } from "react";
import { defaultBlockArea } from "@/constants/constants";
import { initState } from "@/utils/MainUtils";

const MainContext = createContext<GameState>({
  state: initState({ width: 5, height: 5 }),
  setState: () => undefined,
  isDev: false,
  setIsDev: () => undefined,
  blockArea: defaultBlockArea,
  setBlockArea: () => undefined,
  mineGeneratedRef: { current: false },
  gameStateRef: { current: GameStateRef.play },
});

export default MainContext;
