import { BlockState, PlayState } from "@/types";
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
  const gameChangeState = useContext(MainContext);
  const { gameState, setGameState } = gameChangeState;
  const { state, isDev } = gameState;
  // 检查游戏进度
  useEffect(() => {
    checkGameState(state, gameChangeState);
  }, [state]);
  // 点击
  const onClick = (block: BlockState) => {
    if (gameState.playState !== PlayState.play) return;
    const { y, x } = block;
    if (state[y][x].flagged) return;
    if (state[y][x].mine) {
      alert("BOOM!");
      setGameState({
        ...gameState,
        state: showAllMines(gameState.state),
        playState: PlayState.lost,
      });
      // gameStateRef.current = GameStateRef.lost;
      // setState(showAllMines(state));
      return;
    }
    if (!gameState.mineGenerated) {
      setGameState({
        ...gameState,
        mineGenerated: true,
        state: updateNumber(
          generateMines(gameState.state, { y, x }),
          gameState.blockArea,
        ),
      });
    }
    setGameState({
      ...gameState,
      state: produce(gameState.state, (draft) => {
        draft[y][x].revealed = true;
        expendZero(draft[y][x], draft, gameState.blockArea);
      }),
    });
    // setState((state) =>
    //   produce(state, (draft) => {
    //     draft[y][x].revealed = true;
    //     expendZero(draft[y][x], draft, blockArea);
    //   }),
    // );
  };
  // 右键菜单
  const onContextMenu = (e: MouseEvent, block: BlockState) => {
    e.preventDefault();
    const { y, x } = block;
    setGameState({
      ...gameState,
      state: produce(state, (draft) => {
        if (!draft[y][x].revealed) {
          draft[y][x].flagged = !draft[y][x].flagged;
        }
      }),
    });
    // setState(
    //   produce(state, (draft) => {
    //     if (!draft[y][x].revealed) {
    //       draft[y][x].flagged = !draft[y][x].flagged;
    //     }
    //   }),
    // );
  };
  // 重置游戏
  const reset = () => {
    setGameState({
      ...gameState,
      state: initState(gameState.blockArea),
      mineGenerated: false,
      playState: PlayState.play,
    });
    // setState(initState(blockArea));
    // mineGeneratedRef.current = false;
    // gameStateRef.current = GameStateRef.play;
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
          onClick={() =>
            setGameState({ ...gameState, isDev: !gameState.isDev })
          }
        >
          {isDev ? "DEV" : "NORMAL"}
        </button>
      </div>
    </div>
  );
}
export default Container;
