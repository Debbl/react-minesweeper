import type { BlockArea } from "@/types";

const BLOCK_AREA: BlockArea = {
  width: 5,
  height: 5,
};
const MINES = 3;

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
