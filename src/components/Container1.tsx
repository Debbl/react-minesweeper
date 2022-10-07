import { useLocalStorageState } from "ahooks";
import { useEffect, useRef } from "react";
import Block1 from "./Block1";
import type { GameState } from "@/utils/MSGame";
import MSGame from "@/utils/MSGame";
import { initState } from "@/utils/MainUtils";
import { BLOCK_AREA, MINES } from "@/constants/constants";

function Container() {
  const [gameState, setGameState] = useLocalStorageState<GameState>(
    "minesweeper-info",
    {
      defaultValue: {
        board: initState(BLOCK_AREA),
        isDev: false,
        boardArea: BLOCK_AREA,
        gameStatus: "play",
        mineGenerated: false,
        mines: MINES,
      },
    },
  );
  const { current: msGame } = useRef(new MSGame(gameState));
  const { board, isDev } = gameState;
  useEffect(() => {
    return msGame.on("change", setGameState);
  }, []);
  return (
    <div className="inline-flex flex-col items-center gap-2 p-8">
      <div className="flex flex-col">
        {board.map((rows, y) => (
          <div className="flex" key={y}>
            {rows.map((block, x) => (
              <Block1
                key={x}
                isDev={isDev}
                onClick={msGame.onClick}
                onContextMenu={msGame.onContextMenu}
                block={block}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Container;
