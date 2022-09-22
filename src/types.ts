import { IFuncUpdater } from "ahooks/lib/createUseStorageState";

export interface BlockState {
  x: number;
  y: number;
  revealed?: boolean;
  mine?: boolean;
  flagged?: boolean;
  adjacentMines: number;
}

export interface BlockArea {
  width: number;
  height: number;
}

export enum PlayState {
  "play",
  "won",
  "lost",
}

export interface GameState {
  state: BlockState[][];
  isDev: boolean;
  blockArea: BlockArea;
  mineGenerated: boolean;
  playState: PlayState;
}

export interface GameChangeState {
  gameState: GameState;
  setGameState: (value: GameState | IFuncUpdater<GameState>) => void;
}
