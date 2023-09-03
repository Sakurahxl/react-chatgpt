import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import { set } from "lodash";

interface VoiceBarProps {
  url: string;
}

const VoiceBar = (props: VoiceBarProps) => {
  const { url } = props;
  //播放器
  const [audioPlayer, setAudioPlayer] = useState<any>(null);
  //播放状态
  const [isPlay, setIsPlay] = useState(false);
  //播放条
  const audioRef = useRef(null);
  useEffect(() => {
    if (url) {
      // @ts-ignore
      let audio = plus.audio.createPlayer(url);
      setAudioPlayer(audio);
      handleAudioStyleWidth(audio.getDuration());
    }
  }, []);
  //播放
  const playVoice = (audioSrc: string) => {
    setIsPlay(true);
    if (audioSrc) {
      // @ts-ignore
      let audio = plus.audio.createPlayer(audioSrc);
      setAudioPlayer(audio);
      audio.play();
      setTimeout(() => {
        setIsPlay(false);
      }, audioPlayer.getDuration() * 1000);
    }
  };

  // 设置语音条宽度样式
  const handleAudioStyleWidth = (len:number)=> {
    let dom: any = audioRef.current;
    if (len === 1) {
      dom.style.width = "38px";
    } else if (len > 1 && len < 20) {
      dom.style.width = `${38 + (len / 10) * 36}px`;
    } else if (len >= 20) {
      dom.style.width = `${106.39 + (len / 10) * 18.935}px`;
    }
  }

  return (
    <div className={styles["audio-detail-msg"]}>
      <div ref={audioRef} className={`${styles["audio-style"]} ${isPlay && styles['add-animation']}`} onClick={() => playVoice(url)}>
        <div className={styles["small"]}></div>
        <div className={styles["middle"]}></div>
        <div className={styles["large"]}></div>
      </div>
      <div className={styles["duration-seconds"]}>
        {audioPlayer?.getDuration()??"0"}s
      </div>
    </div>
  );
};
export default VoiceBar;
