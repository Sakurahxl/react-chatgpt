import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import { AudioFill } from "antd-mobile-icons";

interface PlayboxProps {
  show: boolean;
}

const Playbox = (props: PlayboxProps) => {
  const { show } = props;
  const playRef = useRef<any>(null);
  const voiceAnimationRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
    // 组件更新时你要执行的代码
    let playBox = playRef.current;
    timerRef.current && clearInterval(timerRef.current);
    if (show) {
      playBox.style.display = "block";
      console.log(voiceAnimationRef.current.classList);
      let time = 0;
      let timer = setInterval(() => {
        time++;
        setDuration(time);
      }, 1000);
      timerRef.current = timer;
    } else {
      playBox.style.display = "none";
      clearInterval(timerRef.current);
    }
  }, [show]);

  useEffect(() => {}, [duration]);

  return (
    <div>
      <div className={styles["audio-record"]} ref={playRef}>
        <p className={styles["duration-seconds-style"]}>
          <span>已录制&nbsp;{duration}s</span>
        </p>
        <div className={styles["icon"]}>
          <AudioFill fontSize={45} />
          <div className={`${styles["voice-animation"]} ${show?styles["start"]:''}`} ref={voiceAnimationRef}>
            {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
              <p key={index}></p>
            ))}
          </div>
        </div>
        <div className={styles["record-sataus"]}>
          <p>录制中。。。</p>
        </div>
      </div>
    </div>
  );
};

export default Playbox;
