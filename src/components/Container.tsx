import { BlockState, GameStateRef } from "@/types";
import { MouseEvent, useContext, useEffect } from "react";
import produce from "immer";
import Block from "./Block";
import MainContext from "@/contexts/MainContext";
import {
  initState,
  updateNumber,
  generateMines,
  expendZero,
  checkGameState,
  showAllMines,
} from "@/utils/MainUtils";

function Container() {
  // 初始化 data
  const {
    state,
    setState,
    isDev,
    setIsDev,
    blockArea,
    mineGeneratedRef,
    gameStateRef,
  } = useContext(MainContext);
  // 检查游戏进度
  useEffect(() => {
    checkGameState(state, gameStateRef);
  }, [state]);
  // 点击
  const onClick = (block: BlockState) => {
    if (gameStateRef.current !== GameStateRef.play) return;
    const { y, x } = block;
    if (state[y][x].flagged) return;
    if (state[y][x].mine) {
      alert("BOOM!");
      gameStateRef.current = GameStateRef.lost;
      setState(showAllMines(state));
      return;
    }
    if (!mineGeneratedRef.current) {
      setState(
        produce((draft) =>
          updateNumber(generateMines(draft, { y, x }), blockArea),
        ),
      );
      mineGeneratedRef.current = true;
    }
    setState((state) =>
      produce(state, (draft) => {
        draft[y][x].revealed = true;
        expendZero(draft[y][x], draft, blockArea);
      }),
    );
  };
  // 右键菜单
  const onContextMenu = (e: MouseEvent, block: BlockState) => {
    e.preventDefault();
    const { y, x } = block;
    setState(
      produce(state, (draft) => {
        if (!draft[y][x].revealed) {
          draft[y][x].flagged = !draft[y][x].flagged;
        }
      }),
    );
  };
  // 重置游戏
  const reset = () => {
    setState(initState(blockArea));
    mineGeneratedRef.current = false;
    gameStateRef.current = GameStateRef.play;
  };
  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-2xl font-bold">扫雷</div>
      <div className="flex w-full justify-evenly">
        <button onClick={() => reset()}>开始</button>
      </div>
      <div className="flex flex-col">
        {state.map((rows, y) => (
          <div key={y} className="flex">
            {rows.map((item, x) => (
              <Block
                key={x}
                block={item}
                onClick={onClick}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2">
        <button
          className="rounded border bg-green-500/50 px-3 text-white"
          onClick={() => setIsDev(!isDev)}
        >
          {isDev ? "DEV" : "NORMAL"}
        </button>
      </div>
    </div>
  );
}
export default Container;
