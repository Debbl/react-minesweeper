import type { BlockState, BoardArea } from "~/types";

// 初始化 state
function initState(boardArea: BoardArea) {
  const { width, height } = boardArea;
  return Array.from({ length: height }, (_, y) =>
    Array.from(
      { length: width },
      (_, x): BlockState => ({
        x,
        y,
        adjacentMines: 0,
        revealed: false,
      }),
    ),
  );
}

function randomRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export {
  initState,
  randomRange,
};

