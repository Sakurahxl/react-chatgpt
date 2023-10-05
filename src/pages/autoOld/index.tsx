import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import Content from "./components/content";
import AudioAnalyser from "@/component/AudioAnalyser";
import { getBaiduToken } from "@/services/api";
import Playbox from "../chatgpt/components/Playbox";
import { NavBar } from "antd-mobile";
import { history } from "umi";

const AutoOld = () => {
  const [isOld, setIsOld] = useState(true);
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const audioProps = {
    // audioType,
    // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
    status,
    audioSrc,
    timeslice: 1000, // 时间切片（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    width: 350,
    backgroundColor: "#ffffff",
    strokeColor: "rgba(0, 0, 0, 1)",
    startCallback: (e: any) => {
      console.log("succ start", e);
    },
    pauseCallback: (e: any) => {
      console.log("succ pause", e);
    },
    stopCallback: (e: any) => {
      setAudioSrc(window.URL.createObjectURL(e));
      console.log("succ stop", e);
    },
    onRecordCallback: (e: any) => {
      console.log("recording", e);
    },
    errorCallback: (err: any) => {
      console.log("error", err);
    },
  };
  const change = () => {
    let autoOld = document.documentElement.style;
    getBaiduToken();
    if (isOld) {
      autoOld.setProperty(`--font-size`, "20px");
      autoOld.setProperty(`--background-color`, "#fffff");
      autoOld.setProperty(`--text-color`, "#000000");
      autoOld.setProperty(`--button-padding`, "10px 20px");
      autoOld.setProperty(`--button-border`, "#ffffff");
      autoOld.setProperty(`--button-hover-background`, "#eeeeee");
    } else {
      autoOld.setProperty(`--font-size`, "12px");
      autoOld.setProperty(`--background-color`, "#FEDFE1");
    }
    setIsOld(!isOld);
  };

  const controlAudio = (str: string) => {
    setStatus(str);
  };

  // useEffect(()=>{
  //   let audioProps = audioRef.current;
  //   audioProps.status = status;
  //   console.log(audioProps);

  //   audioRef.current = audioProps;
  // },[status])

  // useEffect(()=>{

  // audioRef.current = audioProps;
  // },[])

  return (
    <div className={styles["box"]}>
      <NavBar
        onBack={() => history.back()}
        style={{ backgroundColor: "white" }}
      >
        适老化
      </NavBar>
      {/* <Playbox show={isOld}/> */}
      <h1>适老化页面示例</h1>

      <button onClick={change}>点击我进行适老化</button>

      <p>这是一个适合老年人的H5页面示例。</p>
      {/* <Content /> */}
      <div>
        <AudioAnalyser {...audioProps} />
        {/* <p>选择输出格式</p> */}
        <div className="btn-box">
          {status !== "recording" && (
            <button
              className="iconfont icon-start"
              title="开始"
              onClick={() => controlAudio("recording")}
            >
              开始
            </button>
          )}
          {status === "recording" && (
            <button
              className="iconfont icon-pause"
              title="暂停"
              onClick={() => controlAudio("paused")}
            >
              暂停
            </button>
          )}
          <button
            className="iconfont icon-stop"
            title="停止"
            onClick={() => controlAudio("inactive")}
          >
            停止
          </button>
        </div>
        {/* <select name="" id="" >
                    <option value="audio/webm">audio/webm（default, safari does not support ）</option>
                    <option value="audio/wav">audio/wav</option>
                    <option value="audio/mp3">audio/mp3</option>
                    <option value="audio/mp4">audio/mp4</option>
                </select> */}
      </div>
    </div>
  );
};

export default AutoOld;
