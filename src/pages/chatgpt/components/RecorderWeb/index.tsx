import AudioAnalyser from "@/component/AudioAnalyser";
import { AudioFill } from "antd-mobile-icons";
import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import { message } from "antd";
import { Button } from "antd-mobile";

interface RecorderProps {
  pushAudio: (url: string, text: string) => void;
}
//录音组件
const Recorder = (prop: RecorderProps) => {
  const { pushAudio } = prop;
  //是否录音
  const [isRecord, setIsRecord] = useState(false);
  //录音文件
  const [audioSrc, setAudioSrc] = useState("");
  //语音转文字文本
  const [tempText, setTempText] = useState("");
  //网页直接语音转文字
  const recognition = useRef(null);
  //浏览器自带音频
  const [status, setStatus] = useState("");
  const audioProps = {
    // audioType,
    // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
    status,
    audioSrc,
    timeslice: 1000, // 时间切片（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    width: 2000,
    backgroundColor: "rgba(0, 0, 0, 0)",
    strokeColor: "rgba(0, 0, 0, 1)",
    startCallback: (e: any) => {
      // console.log("succ start", e);
    },
    pauseCallback: (e: any) => {
      // console.log("succ pause", e);
    },
    stopCallback: (e: any) => {
      let url = window.URL.createObjectURL(e);
      setAudioSrc(url);
      if (tempText.length === 0) {
        message.error("语音转换识别失败");
        return;
      }
      pushAudio(url, tempText);
      // console.log("succ stop", e);
    },
    onRecordCallback: (e: any) => {
      // console.log("recording", e);
    },
    errorCallback: (err: any) => {
      console.log("error", err);
    },
  };

  //语音转文字部署,google需要vpn
  useEffect(() => {
    // @ts-ignore
    var SpeechRecognition: any = webkitSpeechRecognition || SpeechRecognition;
    let reco = new SpeechRecognition();
    reco.continuous = true;
    reco.interimResults = true;
    reco.lang = "zh-CN";
    reco.addEventListener("result", (event: any) => {
      let result = "";
      for (let i = 0; i <= event.resultIndex; i++) {
        result += event.results[i][0].transcript;
      }
      setTempText(result);
    });

    reco.onstart = function () {
      console.log("语音已开启");
    };

    reco.onend = function () {
      console.log("语音已关闭");
      setTempText("");
      setIsRecord(false);
    };

    reco.onerror = function () {
      message.error("语音转换出错");
      reco.stop();
      controlAudio("inactive");
    };
    recognition.current = reco;
  }, []);

  useEffect(() => {}, [tempText]);

  //开始录音
  const recordStart = () => {
    let reco: any = recognition.current;
    try {
      reco.start();
      controlAudio("recording");
    } catch (e) {
      message.error("语音开启失败，请等待语音识别完后重试");
      reco.stop();
      console.log(e);
    }
    setIsRecord(true);
  };

  //停止录音
  const recordStop = () => {
    let reco: any = recognition.current;
    reco.stop();
    controlAudio("inactive");
    setIsRecord(false);
  };

  //控制录音状态
  const controlAudio = (str: string) => {
    setStatus(str);
  };

  return (
    <div className={styles.recorderWeb}>
      {isRecord ? (
        <Button color="danger" onClick={recordStop}>
          停止录音
        </Button>
      ) : (
        <Button color="primary" onClick={recordStart}>
          <AudioFill fontSize={20} />
        </Button>
      )}
      <AudioAnalyser show={isRecord} {...audioProps} />
    </div>
  );
};

export default Recorder;
