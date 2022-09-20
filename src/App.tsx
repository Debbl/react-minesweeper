import { useState } from "react";
import produce from "immer";
import clsx from "clsx";
import { GiMineExplosion } from "react-icons/all";
import "./style.scss";

let dev = false;

interface BlockState {
  x: number;
  y: number;
  revealed?: boolean;
  mine?: boolean;
  flagged?: boolean;
  adjacentMines: number;
}

const WIDTH = 10;
const HEIGHT = 10;

// 生成炸弹
function generateMines(
  state: BlockState[][],
  initial: { y: number; x: number }
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
        block.mine = Math.random() < 0.1;
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
    draft.forEach((rows, y) => {
      rows.forEach((block, x) => {
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
      })
    )
  );
}
// 炸弹和按钮的样式
function getBlockClass(item: BlockState) {
  if (!item.revealed) return ["btn-mine", "unrevealed-mine"];
  return ["btn-mine", item.mine ? "active-mine" : ""];
}

// 数字的样式
const numberColors = [
  "transparent",
  "blue",
  "green",
  "skyblue",
  "orange",
  "red",
  "purple",
  "pink",
  "red",
];
function getBlockStyle(item: BlockState) {
  if (!item.revealed) return {};
  return {
    color: numberColors[item.adjacentMines],
    border: "1px solid rgba(156,163,175,0.1)",
  };
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
    if (!otherBlock.revealed) {
      otherBlock.revealed = true;
      expendZero(otherBlock, state);
    }
  });
}

function App() {
  // 初始化 data
  const [state, setState] = useState(initState);
  // 点击
  const onClick = (y: number, x: number) => {
    if (!mineGenerated) {
      setState(
        produce((draft) => updateNumber(generateMines(draft, { y, x })))
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
      })
    );
  };
  return (
    <div className="app">
      <div className="container">
        {state.map((rows, y) => (
          <div key={y} className="rows">
            {rows.map((item, x) => (
              <button
                key={x}
                className={clsx(getBlockClass(item))}
                onClick={() => onClick(item.y, item.x)}
                style={!item.mine ? getBlockStyle(item) : {}}
              >
                {item.mine
                  ? (item.revealed || dev) && <GiMineExplosion />
                  : (item.revealed || dev) && item.adjacentMines}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
