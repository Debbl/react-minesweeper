import type { BlockArea } from "@/types";

const BLOCK_AREA: BlockArea = {
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

export { BLOCK_AREA, DIRECTIONS, MINES };
