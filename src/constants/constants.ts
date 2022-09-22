import type { BlockArea } from "@/types";

const defaultBlockArea: BlockArea = {
  width: 5,
  height: 5,
};

const directions = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

export { defaultBlockArea, directions };
