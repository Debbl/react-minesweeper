import request from "./index";
import type { Mode } from "~/types";

export interface Fields {
  username: string;
  time: number;
  mode: Mode;
  uploadTime: number;
}

export interface Datum {
  recordId: string;
  createdAt: number;
  updatedAt: number;
  fields: Fields;
}
export interface RankingListData {
  code: number;
  message: string;
  data: Datum[];
}

function getRankingList() {
  return request.get<RankingListData>("/minesweeper/getRankList");
}
export default getRankingList;
