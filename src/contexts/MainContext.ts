import { PlayState, GameChangeState } from "@/types";
import { defaultBlockArea } from "@/constants/constants";
import { initState } from "@/utils/MainUtils";
import { createContext } from "react";

const MainContext = createContext<GameChangeState>({
  gameState: {
    state: initState({ width: 5, height: 5 }),
    isDev: false,
    blockArea: defaultBlockArea,
    mineGenerated: false,
    playState: PlayState.play,
  },
  setGameState: () => undefined,
});

export default MainContext;
