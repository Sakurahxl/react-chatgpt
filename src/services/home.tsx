import {
  createVideoByDetail,
  createVideoByRanking,
} from "@/pages/home/types/Video";
import axios from "@/utils/axios";
import { URL_PREFIX } from "./config";

// 获取首页轮播图
// export const getBanner = async () => {
//   const data = await axios.get(`${"http://localhost:3010"}/round-sowing`);
//   console.log(data);
// };

// 获取视频列表
export const getRankings = async (rId: number) => {
  const data = await axios.get(`${URL_PREFIX}/getRankings?rId=${rId}`);
  const list = data.data.data.list;
  return list.map((data: any) => createVideoByRanking(data));
};

// 获取视频详情
export const getVideoDetail = async (aId: number) => {
  const data = await axios.get(`${URL_PREFIX}/av/${aId}`);
  const video = createVideoByDetail(data.data.data);
  getVideoUrl(aId, video.cId).then((res) => {
    video.url = res.durl[0].url;
  });
  return video;
};

// 获取推荐视频
export const getRecommendVideo = async (aId: number) => {
  const data = await axios.get(`${URL_PREFIX}/av/recommend/${aId}`);
  return data;
};

// 获取视频播放地址
export const getVideoUrl = async (aId: number, cId: number) => {
  const data = await axios.get(
    `${URL_PREFIX}/av/play_url?aId=${aId}&cId=${cId}`
  );
  return data.data.data;
};

//获取评论列表
export const getCommentsList = async (aId: number, p: number) => {
  const data = await axios.get(`${URL_PREFIX}/av/replay?aId=${aId}&p=${p}`);
  return data.data;
};

//获取弹幕列表
export const getBarragesList = async (cId: number) => {
  const data = await axios.get(`${URL_PREFIX}/av/barrage/${cId}`);
  console.log(data);
  
  return data.data;
};