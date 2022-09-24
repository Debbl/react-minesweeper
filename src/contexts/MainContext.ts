import { GameStateRef, GameChangeState } from "@/types";
import { createContext } from "react";
import { BLOCK_AREA, MINES } from "@/constants/constants";
import { initState } from "@/utils/MainUtils";

const MainContext = createContext<GameChangeState>({
  state: initState(BLOCK_AREA),
  setState: () => undefined,
  isDev: false,
  setIsDev: () => undefined,
  blockArea: BLOCK_AREA,
  mines: MINES,
  setMines: () => undefined,
  setBlockArea: () => undefined,
  mineGeneratedRef: { current: false },
  gameStateRef: { current: GameStateRef.play },
  setGameState: () => undefined,
});

export default MainContext;
