import { useLocalStorageState } from "ahooks";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify-icon/react";
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
        isDev: true,
        boardArea: BLOCK_AREA,
        gameStatus: "play",
        mineGenerated: false,
        mines: MINES,
      },
    },
  );
  const { current: msGame } = useRef(new MSGame(gameState));
  const { board, isDev, mines } = gameState;
  const mineCount
    = mines - board.flat().reduce((a, b) => a + (b.flagged ? 1 : 0), 0);
  useEffect(() => {
    return msGame.on("change", setGameState);
  }, []);
  return (
    <div className="inline-flex flex-col items-center gap-2 p-8">
      <div className="flex w-full justify-evenly ">
        <div className="flex items-center text-3xl">
          <Icon icon="mdi:mine" />
          <span>{mineCount}</span>
        </div>
        <button className="btn" onClick={msGame.reset}>
          新游戏
        </button>
      </div>
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
