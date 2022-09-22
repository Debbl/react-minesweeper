import { IFuncUpdater } from "ahooks/lib/createUseStorageState";
import type { Dispatch, SetStateAction, MutableRefObject } from "react";

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

export enum GameStateRef {
  "play",
  "won",
  "lost",
}

export interface GameState {
  state: BlockState[][];
  setState: Dispatch<SetStateAction<BlockState[][]>>;
  isDev: boolean;
  setIsDev: Dispatch<SetStateAction<boolean>>;
  blockArea: BlockArea;
  setBlockArea: Dispatch<SetStateAction<BlockArea>>;
  mineGeneratedRef: MutableRefObject<boolean>;
  gameStateRef: MutableRefObject<GameStateRef>;
}

export interface GameChangeState extends GameState {
  setGameState: (
    value:
      | {
          state: BlockState[][];
          isDev: boolean;
          blockArea: BlockArea;
          mineGeneratedRef: boolean;
          gameStateRef: GameStateRef;
        }
      | IFuncUpdater<{
          state: BlockState[][];
          isDev: boolean;
          blockArea: BlockArea;
          mineGeneratedRef: boolean;
          gameStateRef: GameStateRef;
        }>,
  ) => void;
}
