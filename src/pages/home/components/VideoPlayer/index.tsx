import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import Barrage, { BarrageType } from "../Barrage";
import { formatDuration } from "@/utils/string";
import loading from "@/assets/loading.svg";
import { context } from "@/services/context";
import Hls from "hls.js";
import { getBarragesList } from "@/services/home";
import useSetState from "ahooks/lib/useSetState";

interface VideoPlayerProps {
  live: boolean;
  isLive?: boolean;
  liveTime?: number;
  video: {
    aId: number;
    cId: number;
    title: string;
    cover: string;
    duration: number;
    url: string;
  };
}

interface VideoPlayerState {
  duration: number;
  paused: boolean;
  waiting: boolean;
  barrageSwitch: boolean;
  fullscreen: boolean;
  finish: boolean;
  isShowCover: boolean;
  isShowControlBar: boolean;
  isShowPlayBtn: boolean;
  isLive: boolean;
}

const VideoPlayer = (props: any) => {
  const defaultProps = {
    live: false,
    isLive: false,
    liveTime: 0,
  };
  const { video } = props;
  const [live, setLive] = useState(defaultProps);
  const [initBarrages, setInitBarrages] = useState([]);
  const [barrages, setBarrages] = useState([]);
  //true为电脑端，false为手机端
  const [judgeEnvir, setJudgeEnvir] = useState(true);
  const videoRef = useRef<any>();
  // 弹幕ref
  const barrageRef = useRef<any>();
  // 当前播放时间ref
  const currentTimeRef = useRef<any>();
  // 播放进度ref
  const progressRef = useRef<any>();
  // 直播时长ref
  const liveDurationRef = useRef<any>();
  const [control, setControl] = useSetState<VideoPlayerState>({
    duration: 0,
    paused: true,
    waiting: false,
    barrageSwitch: true,
    fullscreen: false,
    finish: false,
    isShowCover: true,
    isShowControlBar: false,
    isShowPlayBtn: false,
    isLive: live.isLive,
  });
  const playBtnClass = control.paused === true ? styles.play : styles.pause;

  useEffect(() => {
    initVideo();
  }, []);

  useEffect(() => {}, [control]);

  const getVideoUrl = (url: string) => {
    const { videoURL } = context;
    url = encodeURIComponent(url);
    // 拼接播放源地址
    return `${videoURL}?video=${url}`;
  };

  const getPicUrl = (url: string) => {
    const { picURL } = context;
    return `${picURL}?pic=${url}`;
  };

  const initVideo = () => {
    setJudgeEnvir(window.navigator.userAgent.indexOf("Html5Plus") === -1);
    const barrageComponent = barrageRef.current;
    const videoDOM = videoRef.current;
    const currentTimeDOM = currentTimeRef.current;
    const progressDOM = progressRef.current;

    const play = () => {
      setControl((prev) => ({
        isShowCover: false,
        paused: false,
        waiting: false,
      }));
    };

    // 调用play方法时触发
    videoDOM.addEventListener("play", play);

    // 暂停或者在缓冲后准备重新开始播放时触发
    videoDOM.addEventListener("playing", play);

    videoDOM.addEventListener("waiting", () => {
      setControl((prev) => ({
        waiting: true,
      }));
    });

    // 非直播时处理
    if (live.live === false) {
      getBarrages();
      videoDOM.addEventListener("timeupdate", () => {
        if (control.duration === 0) {
          setControl((prev) => ({
            duration: videoDOM.duration,
          }));
        }
        currentTimeDOM.innerHTML = formatDuration(
          videoDOM.currentTime,
          "0#:##"
        );
        const progress = (videoDOM.currentTime / videoDOM.duration) * 100;
        progressDOM.style.width = `${progress}%`;

        if (control.barrageSwitch === true) {
          const barrages = findBarrages(videoDOM.currentTime);
          barrages.forEach((barrage: any) => {
            // 发送弹幕
            console.log(barrage);

            barrageComponent.send(barrage);
          });
        }
      });

      videoDOM.addEventListener("ended", () => {
        currentTimeDOM.innerHTML = "00:00";
        progressDOM.style.width = "0";
        setControl((prev) => ({
          paused: false,
          isShowControlBar: false,
          isShowPlayBtn: false,
          fullscreen: false,
          finish: true,
        }));

        // 重新赋值弹幕列表
        setBarrages([...initBarrages.slice()]);
        // 清除弹幕
        barrageComponent.clear();
      });

      /**
       * 进度条事件
       */
      // 总进度条宽度
      let width = 0;
      // 距离屏幕左边距离
      let left = 0;
      // 拖拽进度比例
      let rate = 0;
      progressDOM.addEventListener("touchstart", (e: any) => {
        e.stopPropagation();

        const progressWrapperDOM = progressDOM.parentElement;
        width = progressWrapperDOM.offsetWidth;
        left = progressWrapperDOM.getBoundingClientRect().left;

        playOrPause();
      });

      progressDOM.addEventListener("touchmove", (e: any) => {
        e.preventDefault();

        const touch = e.touches[0];
        // 计算拖拽进度比例
        rate = (touch.clientX - left) / width;
        if (rate > 1) {
          rate = 1;
        } else if (rate < 0) {
          rate = 0;
        }
        const currentTime = videoDOM.duration * rate;
        progressDOM.style.width = `${rate * 100}%`;
        currentTimeDOM.innerHTML = formatDuration(currentTime, "0#:##");
      });
      progressDOM.addEventListener("touchend", () => {
        videoDOM.currentTime = videoDOM.duration * rate;

        playOrPause();
      });

      // 判断是否为电脑端,电脑端支持点击拖拽进度条
      if (judgeEnvir) {
        console.log("电脑端");
        
        progressDOM.addEventListener("mousedown", (e: any) => {
          e.stopPropagation();

          const progressWrapperDOM = progressDOM.parentElement;
          width = progressWrapperDOM.offsetWidth;
          left = progressWrapperDOM.getBoundingClientRect().left;

          const offsetX = e.clientX - left;
          rate = offsetX / width;
          if (rate > 1) {
            rate = 1;
          } else if (rate < 0) {
            rate = 0;
          }
          const currentTime = videoDOM.duration * rate;
          progressDOM.style.width = `${rate * 100}%`;
          currentTimeDOM.innerHTML = formatDuration(currentTime, "0#:##");

          playOrPause();
        });

      //   progressDOM.addEventListener("mousedown", (e: { stopPropagation?: any; clientX?: number; }) => {
      //     e.stopPropagation();
      //     handleMouseDown(e);
      //   });
      //   const handleMouseMove = (e: { clientX: number; }) => {
      //     if (!progressBarRef.current) return;

      //     const rect = progressBarRef.current.getBoundingClientRect();
      //     const offsetX = e.clientX - rect.left;
      //     const width = rect.width;
      //     let newProgress = (offsetX / width) * 100;

      //     if (newProgress < 0) newProgress = 0;
      //     if (newProgress > 100) newProgress = 100;

      //     setProgress(newProgress);
      //     if (onChange) onChange(newProgress);
      //   };

      //   const handleMouseUp = () => {
      //     document.removeEventListener("mousemove", handleMouseMove);
      //     document.removeEventListener("mouseup", handleMouseUp);
      //   };

      //   const handleMouseDown = (e: { clientX: number; }) => {
      //     handleMouseMove(e);
      //     document.addEventListener("mousemove", handleMouseMove);
      //     document.addEventListener("mouseup", handleMouseUp);
      //   };
      }
    } else {
      // 直播时处理
      if (live.liveTime) {
        const liveDurationDOM = liveDurationRef.current;
        let liveDuration = (new Date().getTime() - live.liveTime) / 1000;
        liveDurationDOM.innerHTML = formatDuration(liveDuration, "0#:##:##");
        setInterval(() => {
          liveDuration += 1;
          liveDurationDOM.innerHTML = formatDuration(liveDuration, "0#:##:##");
        }, 1000);
      }

      // 支持m3u8，直接使用video播放
      if (videoDOM.canPlayType("application/vnd.apple.mpegurl")) {
        videoDOM.src = video.url;
        videoDOM.addEventListener("canplay", () => {
          videoDOM.play();
        });
        videoDOM.addEventListener("error", () => {
          setControl((prev) => ({
            isLive: false,
          }));
        });
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(video.url);
        hls.attachMedia(videoDOM);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoDOM.play();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (
              data.type === Hls.ErrorTypes.NETWORK_ERROR ||
              data.response?.code === 404
            ) {
              setControl((prev) => ({
                isLive: false,
              }));
            }
          }
        });
      }
    }
  };

  /**
   * 根据时间查找弹幕
   */
  const findBarrages = (time: any) => {
    // 查找到的弹幕
    const tempBarrages: any = [];
    // 查找到的弹幕索引
    const indexs: any = [];
    barrages.forEach((barrage: any, index: any) => {
      // 换成整数秒
      if (parseInt(barrage.time, 10) === parseInt(time, 10)) {
        tempBarrages.push(barrage);
        indexs.push(index);
      }
    });
    indexs.forEach((index: any, i: any) => {
      // 删除掉已经查找到的弹幕
      barrages.splice(index - i, 1);
    });
    return tempBarrages;
  };

  /**
   * 获取弹幕列表
   */
  const getBarrages = () => {
    getBarragesList(video.cId).then((result) => {
      const barrages: any = [];
      if (result.code === "1") {
        result.data.forEach((data: any) => {
          barrages.push({
            type: data.type === "1" ? BarrageType.RANDOM : BarrageType.FIXED,
            color: "#" + Number(data.decimalColor).toString(16),
            content: data.content,
            time: Number(data.time),
          });
        });
      }
      // 初始化弹幕列表
      setInitBarrages(barrages);
      setBarrages(initBarrages.slice());
    });
  };

  /**
   * 显示或隐藏控制器
   */
  const showOrHideControls = () => {
    if (control.isShowControlBar === true) {
      setControl((prev) => ({
        isShowControlBar: false,
        isShowPlayBtn: false,
      }));
    } else {
      setControl((prev) => ({
        isShowControlBar: true,
        isShowPlayBtn: true,
      }));
    }
  };

  /**
   * 播放或暂停
   */
  const playOrPause = () => {
    const videoDOM = videoRef.current;
    if (control.paused === true) {
      videoDOM.play();
      setControl((prev) => ({
        paused: false,
        isShowPlayBtn: true,
        finish: false,
      }));
      let temp = {
        ...control,
        paused: false,
        isShowPlayBtn: true,
        finish: false,
      };

      // 3秒后播放按钮显示如果显示则隐藏
      setTimeout(() => {
        if (temp.isShowPlayBtn === true) {
          setControl((prev) => ({
            isShowControlBar: false,
            isShowPlayBtn: false,
          }));
        }
      }, 3000);
    } else {
      videoDOM.pause();
      setControl((prev) => ({
        paused: true,
      }));
    }
  };

  /**
   * 改变播放位置
   */
  const changePlayPosition = (e: any) => {
    e.stopPropagation();
    const progressWrapperDOM = e.currentTarget;
    const left = progressWrapperDOM.getBoundingClientRect().left;
    const progress = (e.clientX - left) / progressWrapperDOM.offsetWidth;
    const videoDOM = videoRef.current;
    videoDOM.currentTime = videoDOM.duration * progress;
    videoDOM.play();
    setControl((prev) => ({
      isShowControlBar: false,
    }));

    setTimeout(() => {
      if (control.isShowPlayBtn === true) {
        setControl((prev) => ({
          isShowPlayBtn: false,
        }));
      }
    }, 3000);

    // 重新赋值弹幕列表
    setBarrages([...initBarrages.slice()]);
    // 清除弹幕
    barrageRef.current.clear();
  };

  /**
   * 开启或关闭弹幕
   */
  const onOrOff = () => {
    if (control.barrageSwitch === true) {
      barrageRef.current.clear();
      setControl((prev) => ({
        barrageSwitch: false,
      }));
    } else {
      setControl((prev) => ({
        barrageSwitch: true,
      }));
    }
  };

  /**
   * 进入或退出全屏
   */
  const entryOrExitFullscreen = () => {
    if (control.fullscreen === true) {
      setControl((prev) => ({
        isShowControlBar: false,
        isShowPlayBtn: false,
        fullscreen: false,
      }));
    } else {
      setControl((prev) => ({
        isShowControlBar: false,
        isShowPlayBtn: false,
        fullscreen: true,
      }));
    }
  };

  const wrapperClass =
    control.fullscreen === true
      ? `${styles["video-player"]} ${styles.fullscreen}`
      : styles["video-player"];

  const videoStyle = {
    display: control.isShowCover === true ? "none" : "block",
  };
  const playBtnStyle = {
    display: control.isShowPlayBtn === true ? "block" : "none",
  };
  const coverStyle = {
    display: control.isShowCover === true ? "block" : "none",
  };
  const controlBarStyle = {
    display: control.isShowControlBar === true ? "block" : "none",
  };
  const switchClass =
    control.barrageSwitch === true
      ? styles["barrage-on"]
      : styles["barrage-off"];

  return (
    <div className={wrapperClass}>
      <video
        height="100%"
        width="100%"
        preload="auto"
        x5-playsinline="true"
        webkit-playsinline="true"
        playsInline={true}
        src={live.live === false ? getVideoUrl(video.url) : ""}
        style={videoStyle}
        ref={videoRef}
      />
      <div className={styles.barrage}>
        <Barrage opacity={live.live === false ? 0.75 : 1} ref={barrageRef} />
      </div>
      <div
        className={styles.controls}
        onClick={() => {
          showOrHideControls();
        }}
      >
        <div
          className={styles["play-button"] + " " + playBtnClass}
          style={playBtnStyle}
          onClick={(e) => {
            e.stopPropagation();
            playOrPause();
          }}
        />
        <div
          className={
            styles["control-bar"] +
            (live.live === true ? " " + styles["live-control"] : "")
          }
          style={controlBarStyle}
        >
          {live.live === false ? (
            <>
              <div className={styles.left}>
                <span className={styles.time} ref={currentTimeRef}>
                  00:00
                </span>
                <span className={styles.split}>/</span>
                <span className={styles["total-duration"]}>
                  {formatDuration(control.duration, "0#:##")}
                </span>
              </div>
              <div className={styles.center}>
                <div
                  className={styles["progress-wrapper"]}
                  onClick={(e) => {
                    changePlayPosition(e);
                  }}
                >
                  <div className={styles.progress} ref={progressRef} />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.left} ref={liveDurationRef}></div>
          )}
          <div className={styles.right}>
            <div
              className={switchClass}
              onClick={(e) => {
                e.stopPropagation();
                onOrOff();
              }}
            />
            <div
              className={styles.fullscreen}
              onClick={(e) => {
                e.stopPropagation();
                entryOrExitFullscreen();
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.cover} style={coverStyle}>
        {live.live === false ? (
          <>
            <div className={styles.title}>av{video.aId}</div>
            <img
              className={styles.pic}
              src={getPicUrl(video.cover)}
              alt={video.title}
            />
            <div className={styles["pre-play"]}>
              <div className={styles.duration}>
                {formatDuration(video.duration, "0#:##:##")}
              </div>
              <div
                className={styles.preview}
                onClick={() => {
                  playOrPause();
                }}
              />
            </div>
          </>
        ) : (
          <>
            <img className={styles.pic} src={video.cover} alt={video.title} />
            <div className={styles["pre-play"]}>
              <div
                className={styles.preview}
                onClick={() => {
                  playOrPause();
                }}
              />
            </div>
          </>
        )}
      </div>
      {control.waiting === true ? (
        <div className={styles.loading}>
          <div className={styles.wrapper}>
            <img className={styles.img} src={loading} />
            <span className={styles.text}>
              {live.live === false ? "正在缓冲" : ""}
            </span>
          </div>
        </div>
      ) : null}
      {control.finish === true ? (
        <div className={styles["finish-cover"]}>
          <img
            className={styles["cover-pic"]}
            src={video.cover}
            alt={video.title}
          />
          <div className={styles["cover-wrapper"]}>
            <div
              className={styles.replay}
              onClick={() => {
                playOrPause();
              }}
            >
              <i className={styles["replay-icon"]} />
              <span>重新播放</span>
            </div>
          </div>
        </div>
      ) : null}
      {live.live === true && control.isLive == false ? (
        <div className={styles["notice-cover"]}>
          <div className={styles["notice-wrapper"]}>
            <i />
            <span>闲置中...</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default VideoPlayer;
