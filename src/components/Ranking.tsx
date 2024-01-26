import { useEffect, useState } from "react";
import RankItem from "./RankItem";
import type { RankingListData } from "~/services/getRankingList";
import getRankingList from "~/services/getRankingList";

function Ranking() {
  const [rankingList, setRankingList] = useState<RankingListData>();

  useEffect(() => {
    getRankingList().then((response) => {
      setRankingList({ ...response, data: response.data.reverse() });
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3">排行榜</div>
      <ul>
        <RankItem />
        {rankingList?.data.reverse().map((record) => {
          return (
            <RankItem key={record.recordId} userRankInfo={record.fields} />
          );
        })}
      </ul>
    </div>
  );
}
export default Ranking;
