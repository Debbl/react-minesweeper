import { Icon } from "@iconify-icon/react";
import timerIcon from "@iconify/icons-carbon/timer";
import { useEffect, useState } from "react";
import type { GameStatus } from "~/types";

let intervalID: ReturnType<typeof setInterval>;

interface TimerProps {
  startMS: number;
  endMS: number;
  gameStatus: GameStatus;
}
function Timer({ startMS, endMS, gameStatus }: TimerProps) {
  const [timerCount, setTimerCount] = useState(
    Math.floor((endMS - startMS) / 1000)
  );
  useEffect(() => {
    switch (gameStatus) {
      case "won":
      case "lost":
        clearInterval(intervalID);
        break;
      case "ready":
        setTimerCount(0);
        break;
      case "play":
        setTimerCount(Math.floor((new Date().getTime() - startMS) / 1000));
        intervalID = setInterval(() => {
          setTimerCount((state) => state + 1);
        }, 1000);
        break;
    }
    return () => clearInterval(intervalID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus]);
  return (
    <>
      <Icon icon={timerIcon} />
      <span className="w-8">{timerCount}</span>
    </>
  );
}

export default Timer;
