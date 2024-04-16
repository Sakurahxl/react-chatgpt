import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import VideoPlayer from "../components/VideoPlayer";
import styles from "./index.less";
import { Link, useParams } from "umi";
import { Video, createVideo } from "../types/Video";
import {
  getCommentsList,
  getRecommendVideo,
  getVideoDetail,
} from "@/services/home";
import { formatDuration, formatTenThousand } from "@/utils/string";
import { history } from "umi";
import { UpUser } from "../types/UpUser";
import { formatDate } from "@/utils/datetime";
import { context } from "@/services/context";
import storage from "@/utils/storage";
import { Avatar, NavBar } from "antd-mobile";
import { FloatButton, message } from "antd";
import { Image } from "antd-mobile";

interface DetailState {
  loading: boolean;
  recommendVides: Video[];
  showLoadMore: boolean;
  comments: any;
}

const VideoDetail = () => {
  const params = useParams();
  const arrowRef = useRef<any>();
  const infoContainerRef = useRef<any>();
  const infoRef = useRef<any>();
  const infoExpand = useRef<boolean>(false);
  const commentPage = useRef({ pageNumber: 1, pageSize: 20, count: 0 });
  const [video, setVideo] = useState<Video>();
  const [control, setControl] = useState<DetailState>({
    loading: true,
    recommendVides: [],
    showLoadMore: true,
    comments: [],
  });
  const [aId, setAId] = useState<number>(Number(params.aId?.slice(2)) || 0);
  useEffect(() => {
    // 不存在视频返回首页
    if (aId === 0) {
      toHome();
      return;
    } 
    getVideoDetail(aId).then((res: Video | null) => {
      // 找不到视频返回首页
      if (res===null) {
        toHome();
        return;
      }
      setTimeout(() => {
        setVideo(res);
      }, 500);
      // 记录当前视频信息
      storage.setViewHistory({
        aId: res.aId,
        title: res.title,
        pic: res.pic,
        viewAt: new Date().getTime(),
      });
    });
    getRecommentVideos(aId);
  }, []);
  
  useEffect(() => {
    if (Number(params.aId?.slice(2)) !== aId) {
      location.reload();
    }
  }, [params.aId]);

  useEffect(() => {}, [video]);
  useEffect(() => {}, [control]);


  // 返回首页
  const toHome = () => {
    history.push({
      pathname: "/home",
    });
    message.error("视频不存在");
  }
  /**
   * 展开或隐藏全部信息
   */
  const toggle = () => {
    const arrowDOM = arrowRef.current;
    const infoContainerDOM = infoContainerRef.current;
    const infoDOM = infoRef.current;
    const titleDOM = infoDOM.getElementsByTagName("div")[0];
    if (infoExpand.current === false) {
      titleDOM.style.whiteSpace = "normal";
      infoContainerDOM.style.height = infoDOM.offsetHeight + "px";
      arrowDOM.classList.add(styles.rotate);
      infoExpand.current = true;
    } else {
      titleDOM.style.whiteSpace = "nowrap";
      infoContainerDOM.style.height = null;
      arrowDOM.classList.remove(styles.rotate);
      infoExpand.current = false;
    }
  };

  const getPubdate = (timestamp: number) => {
    const publicDate = new Date(timestamp * 1000); // unix时间转换成本地时间戳
    let publicDateStr = "";
    const date = new Date();
    if (publicDate.getFullYear() === date.getFullYear()) {
      if (publicDate.getMonth() === date.getMonth()) {
        const diffDate = date.getDate() - publicDate.getDate();
        switch (diffDate) {
          case 0:
            if (date.getHours() - publicDate.getHours() === 0) {
              publicDateStr =
                date.getMinutes() - publicDate.getMinutes() + "分钟前";
            } else {
              publicDateStr =
                date.getHours() - publicDate.getHours() + "小时前";
            }
            break;
          case 1:
            publicDateStr = "昨天";
            break;
          case 2:
            publicDateStr = "前天";
            break;
          default:
            publicDateStr =
              publicDate.getMonth() + 1 + "-" + publicDate.getDate();
        }
      } else {
        publicDateStr = publicDate.getMonth() + 1 + "-" + publicDate.getDate();
      }
    } else {
      publicDateStr =
        publicDate.getFullYear() +
        "-" +
        (publicDate.getMonth() + 1) +
        "-" +
        publicDate.getDate();
    }
    return publicDateStr;
  };

  const getPicUrl = (url: string, format: string) => {
    const { picURL } = context;
    let suffix = ".webp";
    // 默认头像
    if (url.indexOf(".gif") !== -1) {
      return `${picURL}?pic=${url}`;
    }
    return `${picURL}?pic=${url}${format + suffix}`;
  };

  const toSpace = (mId: number) => {
    history.push({
      pathname: "/space/" + mId,
    });
  };

  const loadMoreComment = () => {
    commentPage.current.pageNumber += 1;
    if (!params.aId) {
      return;
    }
    getComments(aId, null);
  };

  const getRecommentVideos = (aId: number) => {
    getRecommendVideo(aId).then((result) => {
      const recommendVides = result.data.data.map((item: any) =>
        createVideo(item)
      );
      // 获取评论
      getComments(aId, recommendVides);
    });
  };

  const getComments = (aId: number, recommendVides: any) => {
    getCommentsList(aId, commentPage.current.pageNumber).then((result) => {
      const page = result.data.page;
      const maxPage = Math.ceil(page.count / page.size);
      const showLoadMore =
        commentPage.current.pageNumber < maxPage ? true : false;

      commentPage.current = {
        pageNumber: commentPage.current.pageNumber,
        pageSize: page.size,
        count: page.count,
      };
      let comments = [];
      if (result.data.replies) {
        comments = result.data.replies.map((item: any) => {
          let date: any = new Date(item.ctime * 1000); // unix时间转换成本地时间戳
          date = formatDate(date, "yyyy-MM-dd hh:mm");
          return {
            content: item.content.message,
            date,
            user: {
              ...new UpUser(
                item.member.mid,
                item.member.uname,
                item.member.avatar
              ),
            },
          };
        });
      }

      setControl({
        ...control,
        loading: false,
        recommendVides: recommendVides || control.recommendVides,
        showLoadMore,
        comments: control.comments.concat(comments),
      });
    });
  };

  return (
    <div className="video-detail">
      <div className={styles["top-wrapper"]}>
        <NavBar
          onBack={() => {
            history.back();
          }}
          style={{ backgroundColor: "white" }}
        >
          <Header display={false}/>
        </NavBar>
      </div>
      {/* 内容 */}
      <div className={styles["content-wrapper"]}>
        <div className={styles["video-container"]}>
          {video && (
            <VideoPlayer
              video={{
                aId: video.aId,
                cId: video.cId,
                title: video.title,
                cover: video.pic,
                duration: video.duration,
                url: video.url,
              }}
            />
          )}
        </div>
        {/* 视频信息 */}
        <div className={styles["video-info-container"]} ref={infoContainerRef}>
          <i
            className={`icon-arrow-down ${styles["icon-arrow"]}`}
            ref={arrowRef}
            onClick={toggle}
          />
          <div className={styles["info-wrapper"]} ref={infoRef}>
            <div className={styles.title}>{video?.title}</div>
            <div className={styles["video-info"]}>
              <Link to={"/space/" + video?.owner?.mId}>
                <span className={styles["up-user-name"]}>
                  {video?.owner?.name}
                </span>
              </Link>
              <span className={styles.play}>
                {formatTenThousand(video?.playCount || 0)}次观看
              </span>
              <span>{formatTenThousand(video?.barrageCount || 0)}弹幕</span>
              <span>{getPubdate(video?.publicDate || 0)}</span>
            </div>
            <div className={styles.desc}>{video?.desc}</div>
            <div className={styles.position}>
              <a href="/index">主页</a>
              <span>&gt;</span>
              <a href={"/channel/" + video?.oneLevel?.id}>
                {video?.oneLevel?.name}
              </a>
              <span>&gt;</span>
              <a href={"/channel/" + video?.twoLevel?.id}>
                {video?.twoLevel?.name}
              </a>
              <span>&gt;</span>
              <span className={styles.aid}>av{video?.aId}</span>
            </div>
          </div>
        </div>
        {/* 推荐列表 */}
        <div className={styles["recommend-list"]}>
          {control.recommendVides.map((v: Video) => (
            <div className={styles["video-wrapper"]} key={v.aId}>
              <a
                onClick={() => {
                  history.push("/home/video/av" + v.aId);
                }}
              >
                <div className={styles["image-container"]}>
                  <Image src={getPicUrl(v.pic, "@320w_200h")} alt={v.title} lazy/>
                  <div className={styles.duration}>
                    {formatDuration(v.duration, "0#:##:##")}
                  </div>
                </div>
                <div className={styles["info-wrapper"]}>
                  <div className={styles.title}>{v.title}</div>
                  <div className={styles["up-user"]}>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        toSpace(v?.owner?.mId || 0);
                      }}
                    >
                      {v?.owner?.name}
                    </span>
                  </div>
                  <div className={styles["video-info"]}>
                    <span>{formatTenThousand(v.playCount)}次观看</span>
                    <span>&nbsp;·&nbsp;</span>
                    <span>{formatTenThousand(v.barrageCount)}弹幕</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
          {control.loading === true ? (
            <div className={styles.loading}>加载中...</div>
          ) : null}
        </div>
        {control.comments.length > 0 ? (
          <div className={styles.comment}>
            <div className={styles["comment-title"]}>
              评论
              <span className={styles["comment-count"]}>
                (&nbsp;{commentPage.current.count}&nbsp;)
              </span>
            </div>
            <div className={styles["comment-list"]}>
              {control.comments.map((comment: any, i: string) => (
                <div className={styles["comment-wrapper"]} key={i}>
                  {/* <Link to={"/space/" + comment.user.mId}> */}
                    <Image
                      className={styles["comment-up-pic"]}
                      src={getPicUrl(comment.user.face, "@60w_60h")}
                      alt={comment.user.name}
                      lazy
                    />
                  {/* </Link> */}
                  <span className={styles["comment-time"]}>{comment.date}</span>
                  <div className={styles["comment-up-user"]}>
                    {/* <Link to={"/space/" + comment.user.mId}> */}
                      {comment.user.name}
                    {/* </Link> */}
                  </div>
                  <div className={styles["comment-content"]}>
                    {comment.content}
                  </div>
                </div>
              ))}
            </div>
            {control.showLoadMore === true ? (
              <div
                className={styles["load-more"]}
                onClick={() => {
                  loadMoreComment();
                }}
              >
                点击加载更多评论
              </div>
            ) : (
              <div className={styles["no-more"]}>没有更多了 ~</div>
            )}
          </div>
        ) : null}
      </div>
      <FloatButton.BackTop />
    </div>
  );
};

export default VideoDetail;
