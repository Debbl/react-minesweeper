import { BlockState, GameStateRef } from "@/types";
import { MouseEvent, useContext, useEffect, useState } from "react";
import produce from "immer";
import Block from "./Block";
import MainContext from "@/contexts/MainContext";
import { AiFillEyeInvisible, AiFillEye, AiFillSetting } from "react-icons/ai";
import {
  initState,
  updateNumber,
  generateMines,
  expendZero,
  checkGameState,
  showAllMines,
} from "@/utils/MainUtils";
import Setting from "./Setting";

function Container() {
  // 初始化 data
  const {
    state,
    setState,
    isDev,
    setIsDev,
    blockArea,
    setBlockArea,
    mineGeneratedRef,
    gameStateRef,
    setGameState,
  } = useContext(MainContext);
  const [isShowSetting, setIsShowSetting] = useState(false);
  // 检查游戏进度
  useEffect(() => {
    checkGameState(state, gameStateRef);
  }, [state]);
  // 持久化
  useEffect(() => {
    // 持久化
    setGameState({
      state,
      isDev,
      blockArea,
      mineGeneratedRef: mineGeneratedRef.current,
      gameStateRef: gameStateRef.current,
    });
  }, [state, isDev, blockArea, mineGeneratedRef.current, gameStateRef.current]);
  // 点击
  const onClick = (block: BlockState) => {
    if (gameStateRef.current !== GameStateRef.play) return;
    const { y, x } = block;
    if (state[y][x].flagged) return;
    if (state[y][x].mine) {
      setTimeout(() => {
        alert("BOOM!");
      }, 0);
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
  const reset = (blockArea: { width: number; height: number }) => {
    setState(initState(blockArea));
    mineGeneratedRef.current = false;
    gameStateRef.current = GameStateRef.play;
  };
  // 改变宽高
  const changeBlockArea = (x: number, y: number) => {
    if (blockArea.width + x <= 3 || blockArea.height + y <= 3) return;
    const newBlockArea = {
      width: blockArea.width + x,
      height: blockArea.height + y,
    };
    setBlockArea(newBlockArea);
    reset(newBlockArea);
  };
  return (
    <div className="flex flex-col items-center gap-2">
      {isShowSetting && (
        <Setting
          changeBlockArea={changeBlockArea}
          setIsShowSetting={setIsShowSetting}
          blockArea={blockArea}
        />
      )}
      <div className="text-2xl font-bold">扫雷</div>
      <div className="flex h-8 w-60 justify-evenly text-green-600/50">
        <button className="btn" onClick={() => reset(blockArea)}>
          新游戏
        </button>
        <button
          className="text-teal-600"
          onClick={() => setIsShowSetting(!isShowSetting)}
        >
          <AiFillSetting className="h-8 w-8" />
        </button>
        <button className="text-teal-600" onClick={() => setIsDev(!isDev)}>
          {isDev ? (
            <AiFillEyeInvisible className="h-8 w-8" />
          ) : (
            <AiFillEye className="h-8 w-8" />
          )}
        </button>
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
    </div>
  );
}
export default Container;
