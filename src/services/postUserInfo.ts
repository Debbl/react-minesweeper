import type { Fields, RankingListData } from "./getRankingList";
import request from "./index";

function postUserInfo(data: Fields) {
  return request.post<RankingListData>("/minesweeper/postUserInfo", data);
}
export default postUserInfo;
