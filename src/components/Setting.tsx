import type { BlockArea } from "@/types";
import type { Dispatch, SetStateAction } from "react";

interface ISetting {
  changeBlockArea: (x: number, y: number) => void;
  setIsShowSetting: Dispatch<SetStateAction<boolean>>;
  blockArea: BlockArea;
}

function Setting({ changeBlockArea, setIsShowSetting, blockArea }: ISetting) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-400/50">
      <div className="relative flex h-80 w-80 flex-col items-center justify-center gap-y-3 rounded-xl bg-teal-600/20">
        <button
          className="btn absolute right-3 top-3"
          onClick={() => setIsShowSetting(false)}
        >
          X
        </button>
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
