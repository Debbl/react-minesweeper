import { MouseEvent, useEffect } from "react";
import { useState } from "react";
import produce from "immer";
import { GiMineExplosion, RiFlagFill } from "react-icons/all";

const dev = false;

interface BlockState {
  x: number;
  y: number;
  revealed?: boolean;
  mine?: boolean;
  flagged?: boolean;
  adjacentMines: number;
}

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

// 数字的样式
const numberColors = [
  "text-transparent",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
  "text-purple-500",
  "text-pink-500",
  "text-teal-500",
];

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
      blocks.every(
        (block) =>
          (block.revealed && !block.mine) || (block.flagged && block.mine),
      )
    ) {
      alert("You win!");
    }
  }
}

// 格子的样式
function getBlockClassName(block: BlockState) {
  if (block.flagged) return "bg-gray-500/10";
  if (!block.revealed) return "bg-gray-500/10 hover:bg-gray-500/30";
  return block.mine ? "bg-red-500/50" : numberColors[block.adjacentMines];
}

function Container() {
  // 初始化 data
  const [state, setState] = useState(initState);
  useEffect(() => {
    checkGameState(state);
  });
  // 点击
  const onClick = (y: number, x: number) => {
    if (state[y][x].flagged) return;
    if (state[y][x].mine) {
      alert("BOOM!");
      setState(
        produce(state, (draft) => {
          for (const rows of draft) {
            for (const item of rows) {
              item.revealed = true;
            }
          }
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
        if (!mineGenerated) {
          draft = updateNumber(generateMines(draft, { y, x }));
          mineGenerated = true;
        }
        draft[y][x].revealed = true;
        expendZero(draft[y][x], draft);
      }),
    );
  };
  // 右键菜单
  const onContextMenu = (e: MouseEvent, { y, x }: { y: number; x: number }) => {
    e.preventDefault();
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
      <div className="flex flex-col">
        {state.map((rows, y) => (
          <div key={y} className="flex">
            {rows.map((item, x) => (
              <button
                key={x}
                className={
                  "m-[1px] flex h-11 w-11 items-center justify-center border " +
                  getBlockClassName(item)
                }
                onClick={() => onClick(item.y, item.x)}
                onContextMenu={(e) => onContextMenu(e, { y, x })}
              >
                {item.flagged ? (
                  <RiFlagFill className="text-red-700" />
                ) : item.mine ? (
                  (item.revealed || dev) && <GiMineExplosion />
                ) : (
                  (item.revealed || dev) && item.adjacentMines
                )}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Container;
