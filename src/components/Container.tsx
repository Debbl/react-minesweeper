import { useLocalStorageState } from "ahooks";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify-icon/react";
import Block from "./Block";
import Confetti from "./Confetti";
import MSGame from "~/utils/MSGame";
import { initState } from "~/utils/MainUtils";
import { BOARD_AREA, MINES } from "~/constants/constants";
import type { GameState } from "~/types";

function Container() {
  const [gameState, setGameState] = useLocalStorageState<GameState>(
    "minesweeper-info",
    {
      defaultValue: {
        board: initState(BOARD_AREA),
        isDev: true,
        boardArea: BOARD_AREA,
        gameStatus: "play",
        mineGenerated: false,
        mines: MINES,
      },
    },
  );
  const { current: msGame } = useRef(new MSGame(gameState));
  const { board, isDev, mines, gameStatus } = gameState;
  const mineCount
    = mines - board.flat().reduce((a, b) => a + (b.flagged ? 1 : 0), 0);
  useEffect(() => {
    return msGame.on("change", setGameState);
  }, []);
  return (
    <div className="inline-flex flex-col items-center gap-2 p-8">
      <Confetti passed={gameStatus === "won"} />
      <div className="text-3xl font-medium">扫雷</div>
      <div className="w-80 flex flex-col h-20 justify-between">
        <div className="flex justify-evenly">
          <button className="btn" onClick={msGame.reset}>
            新游戏
          </button>
          <button className="btn" onClick={() => msGame.changeMode("easy")}>简单</button>
          <button className="btn" onClick={() => msGame.changeMode("medium")}>中等</button>
          <button className="btn" onClick={() => msGame.changeMode("hard")}>困难</button>
        </div>
        <div className="flex w-full justify-evenly item-center">
          <div className="flex items-center justify-between text-3xl w-18">
            <Icon icon="mdi:mine" />
            <span className="w-8">{mineCount}</span>
          </div>
          <div className="text-3xl flex items-center" onClick={msGame.toggleDev}>
            {isDev ? (
              <Icon icon="akar-icons:eye-closed" />
            ) : (
              <Icon icon="akar-icons:eye" />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {board.map((rows, y) => (
          <div className="flex" key={y}>
            {rows.map((block, x) => (
              <Block
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
