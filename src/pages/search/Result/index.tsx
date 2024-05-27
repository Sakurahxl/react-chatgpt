import React, { useEffect, useState, useRef, useContext } from "react";
// import LazyLoad from 'react-lazyload';
// import ScrollToTop from '../../components/scroll-to-top/ScrollToTop';
// import { getSearchResult } from '../../api/search';
// import { Video, UpUser, createVideoBySearch } from '../../models';
// import { formatTenThousand, formatDuration } from '../../util/string';
// import { getPicSuffix } from '../../util/image';
// import Context from '../../context';
import { context } from "@/services/context";
import tips from "@/assets/tips.png";
import style from "./index.less";
import { Video, createVideoBySearch } from "@/pages/home/types/Video";
import { UpUser } from "@/pages/home/types/UpUser";
import { getPicSuffix } from "@/utils/image";
import { formatDuration, formatTenThousand } from "@/utils/string";
import { getSearchResult } from "@/services/search";
import { getRankings } from "@/services/home";
import { history } from "umi";
import { FloatButton } from "antd";

interface ResultProps {
  keyword: string;
  staticContext?: { picSuffix: string };
}

enum OrderType {
  TOTALRANK = "totalrank", // 默认
  CLICK = "click", // 播放多
  PUBDATA = "pubdate", // 发布日期
  DM = "dm", // 弹幕
}

enum SearchType {
  ALL = "video", // 综合
  UPUSER = "bili_user", // up主
}

const Result: React.FC<ResultProps> = ({ keyword }) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [upUsers, setUpUsers] = useState<UpUser[]>([]);
  const [upUserCount, setUpUserCount] = useState(0);
  const [orderType, setOrderType] = useState<OrderType>(OrderType.TOTALRANK);
  const [searchType, setSearchType] = useState<SearchType>(SearchType.ALL);
  const [page, setPage] = useState({ pageNumber: 1, pageSize: 20 });

  const { picURL } = context;

  useEffect(() => {
    getResult();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, searchType, orderType]);

  const handleScroll = () => {
    const resultDOM = resultRef.current;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const height = window.innerHeight;
    const contentHeight = resultDOM!.offsetHeight;

    if (scrollTop >= contentHeight - height) {
      setPage((prevPage) => ({
        ...prevPage,
        pageNumber: prevPage.pageNumber + 1,
      }));
    }
  };

  const getResult = () => {
    // getSearchResult({
    //   keyword,
    //   page: page.pageNumber,
    //   size: page.pageSize,
    //   searchType,
    //   order: orderType,
    // }).then(result => {
    //     console.log(result);

    //   if (result.code === '1') {
    //     if (searchType === SearchType.ALL) {
    //       const newVideos = result.data.result.map((item: any) => createVideoBySearch(item));
    //       setVideos(prevVideos => [...prevVideos, ...newVideos]);
    //     } else {
    //       const newUpUsers = result.data.result.map((item: any) => ({
    //         videoCount: item.videos,
    //         ...new UpUser(
    //           item.mid,
    //           item.uname,
    //           item.upic,
    //           item.level,
    //           '',
    //           item.usign,
    //           0,
    //           item.fans
    //         ),
    //       }));
    //       setUpUsers(prevUpUsers => [...prevUpUsers, ...newUpUsers]);
    //       setUpUserCount(result.data.result.length);
    //     }
    //     setLoading(false);
    //   }
    // });

    setLoading(true);
    getRankings(0).then((data) => {
      data = data.filter((item: any) => item.title.includes(keyword));
      setVideos(data);
      setLoading(false);
    });
  };

  const changeSearchType = (newSearchType: SearchType) => {
    if (searchType !== newSearchType) {
      setSearchType(newSearchType);
      setPage({ pageNumber: 1, pageSize: 20 });
      setLoading(true);
      setVideos([]);
      setUpUsers([]);
    }
  };

  const changeOrderType = (newOrderType: OrderType) => {
    if (orderType !== newOrderType) {
      setOrderType(newOrderType);
      setPage({ pageNumber: 1, pageSize: 20 });
      setLoading(true);
      setVideos([]);
    }
  };

  const getPicUrl = (url: string, format: string) => {
    const { picURL } = context;
    let suffix = ".webp";
    return `${picURL}?pic=${url}${format + suffix}`;
  };

  const toVideo = (aId: number) => {
    history.push("/home/video/av" + aId);
  };

  return (
    <div className={style.resultContainer} ref={resultRef}>
      <div className={style.tabContainer}>
        <div className={style.tabItem}>
          <div
            className={`${style.item} ${
              searchType === SearchType.ALL ? style.current : ""
            }`}
            onClick={() => changeSearchType(SearchType.ALL)}
          >
            综合
          </div>
        </div>
        <div className={style.tabItem}>
          <div
            className={`${style.item} ${
              searchType === SearchType.UPUSER ? style.current : ""
            }`}
            onClick={() => changeSearchType(SearchType.UPUSER)}
          >
            UP主
            {upUserCount > 0
              ? upUserCount > 100
                ? "(99+)"
                : `(${upUserCount})`
              : ""}
          </div>
        </div>
      </div>
      {searchType === SearchType.ALL ? (
        <div className={style.resultWrapper}>
          <div className={style.subTab}>
            <div
              className={`${style.sort} ${
                orderType === OrderType.TOTALRANK ? style.current : ""
              }`}
              onClick={() => changeOrderType(OrderType.TOTALRANK)}
            >
              默认排序
            </div>
            <div
              className={`${style.sort} ${
                orderType === OrderType.CLICK ? style.current : ""
              }`}
              onClick={() => changeOrderType(OrderType.CLICK)}
            >
              播放多
            </div>
            <div
              className={`${style.sort} ${
                orderType === OrderType.PUBDATA ? style.current : ""
              }`}
              onClick={() => changeOrderType(OrderType.PUBDATA)}
            >
              新发布
            </div>
            <div
              className={`${style.sort} ${
                orderType === OrderType.DM ? style.current : ""
              }`}
              onClick={() => changeOrderType(OrderType.DM)}
            >
              弹幕多
            </div>
          </div>
          <div className={style.videoList}>
            {videos.map((video, i) => (
              <div className={style.videoWrapper} key={video.aId + i}>
                <a onClick={() => toVideo(video.aId)}>
                  <div className={style.imageContainer}>
                    {/* <LazyLoad height="3.654rem">
                      <img src={getPicUrl('https:' + video.pic, '@200w_125h')} alt={video.title} />
                    </LazyLoad> */}
                    <img
                      src={getPicUrl(video.pic, "@320w_200h")}
                    />
                    <div className={style.duration}>
                      {video.duration}
                    </div>
                  </div>
                  <div className={style.infoWrapper}>
                    <p dangerouslySetInnerHTML={{ __html: video.title }} />
                    <div className={style.ownerWrapper}>
                      <span className={style.iconUp} />
                      <span className={style.owner}>{video.owner?.name}</span>
                    </div>
                    <div className={style.countInfo}>
                      <span className={style.iconPlay} />
                      <span className={style.playCount}>
                        {formatTenThousand(video.playCount)}
                      </span>
                      <span className={style.iconBarrage} />
                      <span className={style.barrageCount}>
                        {formatTenThousand(video.barrageCount)}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={style.upUserList}>
          {upUsers.map((user) => (
            <div className={style.upUserWrapper} key={user.mId}>
              <a href={`/space/${user.mId}`}>
                <div className={style.face}>
                  {/* <LazyLoad height="3rem"> */}
                  <img
                    src={getPicUrl("https:" + user.face, "@120w_120h")}
                    alt={user.name}
                  />
                  {/* </LazyLoad> */}
                </div>
                <div className={style.upInfo}>
                  <div className={style.name}>{user.name}</div>
                  <div className={style.detail}>
                    <span>粉丝：{user.follower}</span>
                    <span>视频：{user.videoCount}</span>
                  </div>
                  <div className={style.sign}>{user.sign}</div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
      {page.pageNumber >= 5 && (
        <div className={style.tips}>
          <img src={tips} />
          <span className={style.text}>刷到底了哟，从头再来吧 ~</span>
        </div>
      )}
      {loading && <div className={style.loading}>(´・ω・｀)正在加载...</div>}
      <FloatButton.BackTop />
    </div>
  );
};

export default Result;
