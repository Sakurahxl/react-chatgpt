import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import styles from "./index.less";
import { SwiperRef, TabBar, Tabs } from "antd-mobile";
import arrowDown from '@/assets/arrow-down.svg';
import { getRankings } from "@/services/home";
import VideoItem from "../components/VideoItem";
import { Video } from "../types/Video";
import { context } from "@/services/context";

const tabItems = [
  { key: "home", title: "首页" },
  { key: "moive", title: "动画" },
  { key: "guochuang", title: "国创" },
  { key: "music", title: "音乐" },
  { key: "dance", title: "舞蹈" },
];



const HomePage = () => {
  const drawerRef = useRef<any>(null);
  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(0
    );
  const [banners, setBanners] = useState<any[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
 

  const handleSwitchClick = () => {
    // drawerRef.current.show();
  };

  useEffect(() => {
    getRankings(0).then((data) => {
      setVideos(data);
    });
  }, []);

  const getPicUrl = (url:string, format:string) => {
    const { picURL } = context;
    let suffix = ".webp";
    return `${picURL}?pic=${url}${format + suffix}`;
  }

  const bannerElements = banners.map((banner) => (
    <div className="swiper-slide" key={banner.id}>
      <a href={banner.url}>
        <img src={getPicUrl(banner.pic, "@480w_300h")} width="100%" height="100%" />
      </a>
    </div>
  ));

  const videoElements = videos.map((video:any) => {
    if (video.pic.indexOf("@320w_200h") === -1) {
      video.pic = getPicUrl(video.pic, "@320w_200h");
    }
    return <VideoItem video={video} key={video.aId} showStatistics={true} />
  });

  // const additionalVideoElements = additionalVideos.map((video:any) => {
  //   if (video.pic.indexOf("@320w_200h") === -1) {
  //     video.pic = getPicUrl(video.pic, "@320w_200h");
  //   }
  //   return <VideoItem video={video} key={video.aId} showStatistics={false} />
  // });

  return (
    <div className="index">
      {/* 顶部 */}
      <div className={styles['top-wrapper']}>
        <Header display={true}/>
        <div className={styles.partition}>
          <div className={styles['tab-bar']}>
            <Tabs
              activeKey={tabItems[activeIndex].key}
              style={{
                "--active-title-color": "#fb7299",
                "--active-line-color": "#fb7299",
              }}
              onChange={(key) => {
                const index = tabItems.findIndex((item) => item.key === key);
                setActiveIndex(index);
                swiperRef.current?.swipeTo(index);
              }}
            >
              {tabItems.map((item) => (
                <Tabs.Tab title={item.title} key={item.key} />
              ))}
            </Tabs>
          </div>
          <div className={styles.switch} onClick={handleSwitchClick}>
            <img src={arrowDown}/>
          </div>
        </div>
        <div className={styles.drawerPosition}>
          {/* <Drawer
            data={tabBarData}
            ref={drawerRef}
            onClick={handleClick}
          /> */}
        </div>
      </div>
      {/* 内容 */}
      <div className={styles['content-wrapper']}>
        {banners.length > 0 ? (
          <div className={styles['banner-slider']}>
            <div className="swiper-container">
              <div className="swiper-wrapper">{bannerElements}</div>
              <div className="swiper-pagination-wrapper">
                <div className="swiper-pagination clear" />
              </div>
            </div>
          </div>
        ) : null}
        <div className={styles['video-list'] + " clear"}>
          {/* {additionalVideoElements} */}
          {videoElements}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
