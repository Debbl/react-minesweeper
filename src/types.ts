export interface BlockState {
  x: number;
  y: number;
  revealed?: boolean;
  mine?: boolean;
  flagged?: boolean;
  adjacentMines: number;
}
export interface BoardArea {
  width: number;
  height: number;
}

export type GameStatus = "ready" | "play" | "won" | "lost" | "submitted";
export type Mode = "easy" | "medium" | "hard";

export interface GameState {
  board: BlockState[][];
  isDev: boolean;
  mines: number;
  boardArea: BoardArea;
  mineGenerated: boolean;
  gameStatus: GameStatus;
  mode: Mode;
  startMS: number;
  endMS: number;
}
