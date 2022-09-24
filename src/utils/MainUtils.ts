import { BlockArea, BlockState, GameStateRef } from "@/types";
import type { MutableRefObject } from "react";
import produce from "immer";
import { DIRECTIONS } from "@/constants/constants";

// 初始化 state
function initState(blockArea: BlockArea) {
  const { width, height } = blockArea;
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
// 生成炸弹
function generateMines(
  state: BlockState[][],
  mines: number,
  blockArea: BlockArea,
  initial: { y: number; x: number },
) {
  const randomRange = (min: number, max: number) => {
    return Math.round(Math.random() * (max - min) + min);
  };
  const placeRandom = (state: BlockState[][]) => {
    const cx = randomRange(0, blockArea.width - 1);
    const cy = randomRange(0, blockArea.height - 1);
    const block = state[cy][cx];
    if (
      Math.abs(initial.x - block.x) <= 1 &&
      Math.abs(initial.y - block.y) <= 1
    )
      return false;
    if (block.mine) return false;
    block.mine = true;
    return true;
  };
  const newState = produce(state, (draft) => {
    Array.from({ length: mines }).forEach(() => {
      let placed = false;
      while (!placed) placed = placeRandom(draft);
    });
  });

  return newState;
}
// 更新格子周围的炸弹数
function updateNumber(state: BlockState[][], blockArea: BlockArea) {
  const newState = produce(state, (draft) => {
    draft.forEach((rows) => {
      rows.forEach((block) => {
        if (block.mine) return;
        getSiblings(block, draft, blockArea).forEach((otherMine) => {
          if (otherMine.mine) {
            block.adjacentMines++;
          }
        });
      });
    });
  });
  return newState;
}
// 获取每个格子周围的 格子数组
function getSiblings(
  block: BlockState,
  state: BlockState[][],
  blockArea: BlockArea,
) {
  const { width, height } = blockArea;
  return DIRECTIONS.map(([dx, dy]) => {
    const x2 = block.x + dx;
    const y2 = block.y + dy;
    if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) return;
    return state[y2][x2];
  }).filter(Boolean) as BlockState[];
}
// 递归打开格子
function expendZero(
  block: BlockState,
  state: BlockState[][],
  blockArea: BlockArea,
) {
  if (block.adjacentMines) return;
  getSiblings(block, state, blockArea).forEach((otherBlock) => {
    if (!otherBlock.revealed && !otherBlock.flagged) {
      otherBlock.revealed = true;
      expendZero(otherBlock, state, blockArea);
    }
  });
}
// 检查游戏进度
function checkGameState(
  state: BlockState[][],
  gameStateRef: MutableRefObject<GameStateRef>,
) {
  const blocks = state.flat();
  if (blocks.every((block) => block.revealed || block.flagged)) {
    if (
      blocks.every(
        (block) =>
          (block.revealed && !block.mine) || (block.flagged && block.mine),
      )
    ) {
      if (gameStateRef.current === GameStateRef.play) {
        gameStateRef.current = GameStateRef.won;
      }
    } else {
      if (gameStateRef.current === GameStateRef.play)
        setTimeout(() => alert("You cheat"));
    }
  } else {
    gameStateRef.current = GameStateRef.play;
  }
}
// 显示所有的炸弹
function showAllMines(state: BlockState[][]) {
  return produce(state, (draft) => {
    draft.flat().forEach((block) => (block.revealed = true));
  });
}

export {
  updateNumber,
  generateMines,
  initState,
  getSiblings,
  expendZero,
  checkGameState,
  showAllMines,
};
