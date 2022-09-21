import type { BlockState } from "@/types";
import { MouseEvent, useContext, useEffect } from "react";
import { useState } from "react";
import produce from "immer";
import Block from "./Block";
import MainContext from "@/contexts/MainContext";

const WIDTH = 5;
const HEIGHT = 5;

// 生成炸弹
function generateMines(
  state: BlockState[][],
  initial: { y: number; x: number },
) {
  const newState = produce(state, (draft) => {
    for (const rows of draft) {
      for (const block of rows) {
        if (Math.abs(initial.x - block.x) < 1) {
          continue;
        }
        if (Math.abs(initial.y - block.y) < 1) {
          continue;
        }
        block.mine = Math.random() < 0.3;
      }
    }
  });
  return newState;
}
// 更新每个格子周围的炸弹
const directions = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];
function updateNumber(state: BlockState[][]) {
  const newState = produce(state, (draft) => {
    draft.forEach((rows) => {
      rows.forEach((block) => {
        if (block.mine) return;
        getSiblings(block, draft).forEach((otherMine) => {
          if (otherMine.mine) {
            block.adjacentMines++;
          }
        });
      });
    });
  });
  return newState;
}
// 初始化 state
function initState() {
  return Array.from({ length: WIDTH }, (_, y) =>
    Array.from(
      { length: HEIGHT },
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      }),
    ),
  );
}

let mineGenerated = false;

// 获取每个格子周围的 格子数组
function getSiblings(block: BlockState, state: BlockState[][]) {
  return directions
    .map(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;
      if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) return;
      return state[y2][x2];
    })
    .filter(Boolean) as BlockState[];
}

function expendZero(block: BlockState, state: BlockState[][]) {
  if (block.adjacentMines) return;
  getSiblings(block, state).forEach((otherBlock) => {
    if (!otherBlock.revealed && !otherBlock.flagged) {
      otherBlock.revealed = true;
      expendZero(otherBlock, state);
    }
  });
}

function checkGameState(state: BlockState[][]) {
  const blocks = state.flat();
  if (blocks.every((block) => block.revealed || block.flagged)) {
    if (
      blocks.every((block) => block.revealed || (block.flagged && block.mine))
    ) {
      alert("You win!");
    } else {
      alert("You cheat");
    }
  }
}

function Container() {
  // 初始化 data
  const [state, setState] = useState(initState);
  const { isDev, setIsDev } = useContext(MainContext);
  useEffect(() => {
    checkGameState(state);
  }, [state]);
  // 点击
  const onClick = (block: BlockState) => {
    const { y, x } = block;
    if (state[y][x].flagged) return;
    if (state[y][x].mine) {
      alert("BOOM!");
      setState(
        produce(state, (draft) => {
          draft[y][x].revealed = true;
        }),
      );
      return;
    }
    if (!mineGenerated) {
      setState(
        produce((draft) => updateNumber(generateMines(draft, { y, x }))),
      );
      mineGenerated = true;
    }
    setState((state) =>
      produce(state, (draft) => {
        draft[y][x].revealed = true;
        expendZero(draft[y][x], draft);
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
  return (
    <div className="flex flex-col items-center">
      <div className="mb-5 text-2xl font-bold">扫雷</div>
      <button onClick={() => setIsDev(!isDev)}>{isDev ? "DEV" : "PLAY"}</button>
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
