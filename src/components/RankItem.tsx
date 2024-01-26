import type { Mode } from "~/types";

interface UserRankInfo {
  username: string;
  time: number;
  mode: Mode;
  uploadTime: number;
}
interface RankItemProps {
  userRankInfo?: UserRankInfo;
}

function formatTime(timeStamp: number) {
  const time = new Date(timeStamp);
  const Year = String(time.getFullYear());
  const Month = String(time.getMonth() + 1).padStart(2, "0");
  const Day = String(time.getDate()).padStart(2, "0");
  const Hours = String(time.getHours()).padStart(2, "0");
  const Mins = String(time.getMinutes()).padStart(2, "0");
  const Seconds = String(time.getSeconds()).padStart(2, "0");

  return `${Year.slice(-2)}/${Month}/${Day} ${Hours}:${Mins}:${Seconds}`;
}

function RankItem({ userRankInfo }: RankItemProps) {
  if (!userRankInfo) return;

  const { username, mode, time, uploadTime } = userRankInfo;

  return (
    <div className="flex justify-center gap-x-2">
      <span className="w-24">{username || "姓名"}</span>
      <span className="w-24">{mode || "模式"}</span>
      <span className="w-12">{time || "耗时"}</span>
      <span className="w-44">
        {uploadTime ? formatTime(uploadTime) : "时间"}
      </span>
    </div>
  );
}

export default RankItem;
