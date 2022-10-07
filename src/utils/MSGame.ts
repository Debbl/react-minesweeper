import type { MouseEvent } from "react";
import EventBus from "./EventBus";
import { randomRange } from "./MainUtils";
import { DIRECTIONS } from "~/constants/constants";
import type { BlockState, GameState, Mode } from "~/types";

interface Events {
  change: GameState;
}

class MSGame extends EventBus<Events> {
  protected gameState: GameState;
  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;
  }

  protected setGameState() {
    this.checkGameState();
    this.emit("change", { ...this.gameState });
  }

  // 初始化棋盘
  protected initBoard() {
    const { width, height } = this.gameState.boardArea;
    const { gameState } = this;
    gameState.mineGenerated = false;
    gameState.gameStatus = "ready";
    this.gameState.board = Array.from({ length: height }, (_, y) =>
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

  // 获取每个格子周围的 格子数组
  protected getSiblings(block: BlockState) {
    const { width, height } = this.gameState.boardArea;
    const { board } = this.gameState;
    return DIRECTIONS.map(([dx, dy]) => {
      const x2 = block.x + dx;
      const y2 = block.y + dy;
      if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) return false;
      return board[y2][x2];
    }).filter(Boolean) as BlockState[];
  }

  // 更新格子周围的炸弹数
  protected updateNumber() {
    const { board } = this.gameState;
    board.forEach((rows) => {
      rows.forEach((block) => {
        if (block.mine) return;
        this.getSiblings(block).forEach((otherMine) => {
          if (otherMine.mine) block.adjacentMines++;
        });
      });
    });
  }

  // 生成炸弹
  protected generateMines(initial: { y: number; x: number; }) {
    const { boardArea, mines, board } = this.gameState;
    const placeRandom = (state: BlockState[][]) => {
      const cx = randomRange(0, boardArea.width - 1);
      const cy = randomRange(0, boardArea.height - 1);
      const block = state[cy][cx];
      if (
        Math.abs(initial.x - block.x) <= 1
        && Math.abs(initial.y - block.y) <= 1
      )
        return false;
      if (block.mine) return false;
      block.mine = true;
      return true;
    };
    Array.from({ length: mines }).forEach(() => {
      let placed = false;
      while (!placed) placed = placeRandom(board);
    });
  }

  // 递归打开格子
  protected expendZero(block: BlockState) {
    if (block.adjacentMines) return;
    this.getSiblings(block).forEach((otherBlock) => {
      if (!otherBlock.revealed && !otherBlock.flagged) {
        otherBlock.revealed = true;
        this.expendZero(otherBlock);
      }
    });
  }

  // 显示所有炸弹格子
  protected showAllBlock() {
    const { board } = this.gameState;
    board.forEach((rows) => {
      rows.forEach((block) => {
        if (block.mine) block.revealed = true;
      });
    });
  }

  // 检查游戏进度
  protected checkGameState() {
    const { gameState } = this;
    const { board, gameStatus } = this.gameState;
    const blocks = board.flat();

    if (blocks.every((block) => block.revealed || block.flagged)) {
      if (
        blocks.every(
          (block) =>
            (block.revealed && !block.mine) || (block.flagged && block.mine),
        )
      ) {
        if (gameStatus === "play") gameState.gameStatus = "won";
      } else {
        if (gameStatus === "play") setTimeout(() => alert("You cheat"));
      }
    } else {
      gameState.gameStatus = "play";
    }
  }

  // 改变棋盘
  protected changeBoard(w: number, h: number, m: number) {
    const { gameState } = this;
    gameState.boardArea = { width: w, height: h };
    gameState.mines = m;
  }

  // 点击
  onClick = (block: BlockState) => {
    const { gameState } = this;
    const { board } = gameState;
    if (gameState.gameStatus !== "play" && gameState.gameStatus !== "ready")
      return;
    const { y, x } = block;
    if (board[y][x].flagged) return;
    if (board[y][x].mine) {
      setTimeout(() => {
        alert("BOOM!");
      });
      gameState.gameStatus = "lost";
      this.showAllBlock();
    }
    if (!gameState.mineGenerated) {
      this.generateMines({ x: block.x, y: block.y });
      this.updateNumber();
      gameState.gameStatus = "play";
      gameState.mineGenerated = true;
    }
    board[y][x].revealed = true;
    this.expendZero(block);
    this.setGameState();
  };

  // 右键点击
  onContextMenu = (e: MouseEvent, block: BlockState) => {
    e.preventDefault();
    const { board, gameStatus } = this.gameState;
    if (gameStatus !== "play") return;
    const { y, x } = block;
    board[y][x].flagged = true;
    this.setGameState();
  };

  // toggle dev
  toggleDev = () => {
    const { gameState } = this;
    gameState.isDev = !gameState.isDev;
    this.setGameState();
  };

  // 改变模式
  changeMode = (mode: Mode) => {
    switch (mode) {
      case "easy":
        this.changeBoard(9, 9, 10);
        break;
      case "medium":
        this.changeBoard(16, 16, 40);
        break;
      case "hard":
        this.changeBoard(16, 30, 99);
        break;
    }
    this.reset();
  };

  // 新游戏
  reset = () => {
    this.initBoard();
    this.setGameState();
  };
}

export default MSGame;
