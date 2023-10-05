import { formatTenThousand } from "@/utils/string";
import styles from "./index.less";
import tv from "@/assets/tv.png";
import { Video } from "../../types/Video";
import playCount from "@/assets/play-count.svg";
import barrageCount from "@/assets/barrage-count.svg";
import { history } from "umi";

interface VideoItemProps {
  video: Video;
  showStatistics: boolean;
}

const toVideo = (aId: number) => {
  history.push("/home/video/av" + aId);
};

const VideoItem = (props: VideoItemProps) => {
  const { video, showStatistics } = props;
  return (
    <div className={styles.video}>
      <a className={styles["video-link"]} onClick={() => toVideo(video.aId)}>
        <div className={styles["image-container"]}>
          <div className={styles["image-wrapper"]}>
            <img className={styles.tv} src={tv} />
            {video.pic ? (
              <img
                src={video.pic}
                className={styles.pic}
                alt={video.title}
                onLoad={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "1";
                }}
              />
            ) : null}
            <div className={styles.cover} />
            {showStatistics === true ? (
              <div className={styles.info}>
                <img className={styles["play-icon"]} src={playCount} />
                <span className={styles["play-count"]}>
                  {video.playCount ? formatTenThousand(video.playCount) : "0"}
                </span>
                <img className={styles["barrage-icon"]} src={barrageCount} />
                <span className={styles["barrage-count"]}>
                  {video.barrageCount
                    ? formatTenThousand(video.barrageCount)
                    : "0"}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.title}>{video.title}</div>
      </a>
    </div>
  );
};

export default VideoItem;
