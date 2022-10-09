import data from "~/data/rank-list";

function Ranking() {
  const RankList = data;
  return (
    <div>
      <div>排行榜</div>
      <ul>
        {RankList.data.map((record) => (
          <li key={record.recordId}>{record.fields.username}</li>
        ))}
      </ul>
    </div>
  );
}
export default Ranking;
