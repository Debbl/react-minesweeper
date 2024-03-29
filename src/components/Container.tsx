import { useLocalStorageState } from "ahooks";
import { useEffect, useRef } from "react";
import { Icon } from "@iconify-icon/react";
import eyeIcon from "@iconify/icons-akar-icons/eye";
import eyeClosed from "@iconify/icons-akar-icons/eye-closed";
import mineIcon from "@iconify/icons-mdi/mine";
import Block from "./Block";
import Confetti from "./Confetti";
import Timer from "./Timer";
import SubmitForm from "./SubmitForm";
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
        isDev: false,
        boardArea: BOARD_AREA,
        gameStatus: "ready",
        mineGenerated: false,
        mode: "easy",
        mines: MINES,
        startMS: new Date().getTime(),
        endMS: new Date().getTime(),
      },
    },
  );
  const { current: msGame } = useRef(new MSGame(gameState!));
  const { board, isDev, mines, gameStatus, startMS, endMS } = gameState!;
  const mineCount =
    mines - board.flat().reduce((a, b) => a + (b.flagged ? 1 : 0), 0);

  useEffect(() => {
    return msGame.on("change", setGameState);
  }, [msGame, setGameState]);

  return (
    <div className="inline-flex select-none flex-col items-center gap-2 p-8">
      <Confetti passed={gameStatus === "won"} />
      {gameStatus === "won" && (
        <SubmitForm
          submit={(username: string | undefined) => msGame.submit(username)}
        />
      )}
      <div className="text-3xl font-medium">扫雷</div>
      <div className="flex h-20 w-72 flex-col justify-between">
        <div className="flex justify-evenly">
          <button className="btn" onClick={msGame.reset}>
            新游戏
          </button>
          <button className="btn" onClick={() => msGame.changeMode("easy")}>
            简单
          </button>
          <button className="btn" onClick={() => msGame.changeMode("medium")}>
            中等
          </button>
          <button className="btn" onClick={() => msGame.changeMode("hard")}>
            困难
          </button>
        </div>
        <div className="flex w-full justify-evenly text-3xl">
          <div className="flex w-16 items-center justify-between">
            <Icon icon={mineIcon} />
            <span className="w-8">{mineCount}</span>
          </div>
          <div className="flex w-16 items-center">
            <Timer startMS={startMS} endMS={endMS} gameStatus={gameStatus} />
          </div>
          <div
            className="flex cursor-pointer items-center"
            onClick={msGame.toggleDev}
          >
            {isDev ? <Icon icon={eyeClosed} /> : <Icon icon={eyeIcon} />}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col pl-4">
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
