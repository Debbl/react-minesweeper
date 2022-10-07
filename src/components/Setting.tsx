import type { Dispatch, MouseEvent, SetStateAction } from "react";
import type { BoardArea } from "~/types";

interface ISetting {
  changeBlockArea: (x: number, y: number) => void;
  changeMines: (count: number) => void;
  setIsShowSetting: Dispatch<SetStateAction<boolean>>;
  blockArea: BoardArea;
  mines: number;
}

function Setting({
  changeBlockArea,
  setIsShowSetting,
  changeMines,
  blockArea,
  mines,
}: ISetting) {
  const closeSetting = (e: MouseEvent) => {
    if (e.target === e.currentTarget) setIsShowSetting(false);
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-slate-400/50"
      onClick={(e) => closeSetting(e)}
    >
      <div className="relative flex h-80 w-80 flex-col items-center justify-center gap-y-3 rounded-xl bg-teal-600/20">
        <button
          className="btn absolute right-3 top-3"
          onClick={() => setIsShowSetting(false)}
        >
          X
        </button>
        <div className="flex items-center gap-x-1">
          <div className="w-16">炸弹 {mines}</div>
          <button className="btn" onClick={() => changeMines(-1)}>
            -
          </button>
          <button className="btn" onClick={() => changeMines(1)}>
            +
          </button>
        </div>
        <div className="flex items-center gap-x-1">
          <div className="w-16">高度 {blockArea.height}</div>
          <button className="btn" onClick={() => changeBlockArea(0, -1)}>
            -
          </button>
          <button className="btn" onClick={() => changeBlockArea(0, 1)}>
            +
          </button>
        </div>
        <div className="flex items-center gap-x-1">
          <div className="w-16">宽度 {blockArea.width}</div>
          <button className="btn" onClick={() => changeBlockArea(-1, 0)}>
            -
          </button>
          <button className="btn" onClick={() => changeBlockArea(1, 0)}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Setting;
