import { BlockArea, BlockState, GameChangeState, PlayState } from "@/types";
import produce from "immer";
import { directions } from "@/constants/constants";

// 初始化 state
function initState(blockArea: BlockArea) {
  const { width, height } = blockArea;
  return Array.from({ length: width }, (_, y) =>
    Array.from(
      { length: height },
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
  return directions
    .map(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;
      if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) return;
      return state[y2][x2];
    })
    .filter(Boolean) as BlockState[];
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
  gameChangeState: GameChangeState,
) {
  const blocks = state.flat();
  const { gameState, setGameState } = gameChangeState;
  if (blocks.every((block) => block.revealed || block.flagged)) {
    if (
      blocks.every(
        (block) =>
          (block.revealed && !block.mine) || (block.flagged && block.mine),
      )
    ) {
      if (gameState.playState === PlayState.play) {
        alert("You win!");
        setGameState({
          ...gameState,
          playState: PlayState.won,
        });
      }
    } else {
      if (gameState.playState === PlayState.play) alert("You cheat");
    }
  } else {
    gameState.playState = PlayState.play;
  }
}
// 现实所有的炸弹
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
