import { useState } from "react";
import lodash from "lodash";
import clsx from "clsx";
import { GiMineExplosion } from "react-icons/all";
import "./style.scss";

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
function generateMines(state: BlockState[][]) {
  const newState = lodash.cloneDeep(state);
  for (const rows of newState) {
    for (const block of rows) {
      block.mine = Math.random() < 0.1;
    }
  }
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
  const newState = lodash.cloneDeep(state);
  newState.forEach((rows, y) => {
    rows.forEach((block, x) => {
      if (block.mine) return;
      directions.forEach(([dx, dy]) => {
        const x2 = block.x + dx;
        const y2 = block.y + dy;
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) return;
        if (newState[y2][x2].mine) {
          block.adjacentMines++;
        }
      });
    });
  });
  return newState;
}
// 初始化 state
function initState() {
  return updateNumber(
    generateMines(
      Array.from({ length: WIDTH }, (_, y) =>
        Array.from(
          { length: HEIGHT },
          (_, x): BlockState => ({
            x,
            y,
            adjacentMines: 0,
            revealed: false,
          })
        )
      )
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
  const classObj = {
    color: numberColors[item.adjacentMines],
    border: "1px solid rgba(156,163,175,0.1)",
  };
  return classObj;
}

function App() {
  // 初始化 data
  const [state, setState] = useState(initState);

  // 点击
  const onClick = (y: number, x: number) => {
    const newState = lodash.cloneDeep(state);
    newState[y][x].revealed = true;
    setState(newState);
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
                  ? item.revealed && <GiMineExplosion />
                  : item.revealed && item.adjacentMines}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;
