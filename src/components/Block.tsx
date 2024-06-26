import mineIcon from "@iconify/icons-mdi/mine";
import type { MouseEvent } from "react";
import { Icon } from "@iconify-icon/react";
import { RiFlagFill } from "react-icons/ri";
import type { BlockState } from "~/types";

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
  if (!block.revealed) return "bg-gray-500/40 hover:bg-gray-500/30";
  return block.mine ? "bg-red-500/50" : numberColors[block.adjacentMines];
}

interface BlockProps {
  onClick: (block: BlockState) => void;
  onContextMenu: (e: MouseEvent, block: BlockState) => void;
  isDev: boolean;
  block: BlockState;
}
function Block(props: BlockProps) {
  const { block, onClick, onContextMenu, isDev } = props;
  return (
    <>
      <button
        className={`m-px flex size-8 items-center justify-center border ${getBlockClassName(
          block,
        )}`}
        onClick={() => onClick(block)}
        onContextMenu={(e) => onContextMenu(e, block)}
      >
        {block.flagged ? (
          <RiFlagFill className="text-red-700" />
        ) : block.mine ? (
          (block.revealed || isDev) && <Icon icon={mineIcon} />
        ) : (
          (block.revealed || isDev) && block.adjacentMines
        )}
      </button>
    </>
  );
}

export default Block;
