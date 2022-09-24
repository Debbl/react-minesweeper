import { MouseEvent, useContext } from "react";
import type { BlockState } from "@/types";
import { GiStarProminences, RiFlagFill } from "react-icons/all";
import MainContext from "@/contexts/MainContext";

// 数字的样式
const numberColors = [
  "text-transparent",
  "text-blue-500",
  "text-green-500",
  "text-yellow-500",
  "text-orange-500",
  "text-red-500",
  "text-purple-500",
  "text-pink-500",
  "text-teal-500",
];

// 格子的样式
function getBlockClassName(block: BlockState) {
  if (block.flagged) return "bg-gray-500/10";
  if (!block.revealed) return "bg-gray-500/10 hover:bg-gray-500/30";
  return block.mine ? "bg-red-500/50" : numberColors[block.adjacentMines];
}

interface BlockType {
  onClick: (block: BlockState) => void;
  onContextMenu: (e: MouseEvent, block: BlockState) => void;
  block: BlockState;
}
function Block(props: BlockType) {
  const { onClick, onContextMenu, block } = props;
  const { isDev } = useContext(MainContext);
  return (
    <>
      <button
        className={
          "m-[1px] flex h-11 w-11 items-center justify-center border " +
          getBlockClassName(block)
        }
        onClick={() => onClick(block)}
        onContextMenu={(e) => onContextMenu(e, block)}
      >
        {block.flagged ? (
          <RiFlagFill className="text-red-700" />
        ) : block.mine ? (
          (block.revealed || isDev) && <GiStarProminences />
        ) : (
          (block.revealed || isDev) && block.adjacentMines
        )}
      </button>
    </>
  );
}

export default Block;
