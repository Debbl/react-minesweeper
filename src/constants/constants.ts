import type { BoardArea } from "~/types";

const BOARD_AREA: BoardArea = {
  width: 9,
  height: 9,
};
const MINES = 10;

const DIRECTIONS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

export { BOARD_AREA, DIRECTIONS, MINES };
