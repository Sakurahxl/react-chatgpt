import { Button, FloatingBubble, Toast } from "antd-mobile";
import { AudioFill } from "antd-mobile-icons";
import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import VConsole from "vconsole";
import { getBaiduToken, speechRecognition } from "@/services/api";
import Playbox from "../Playbox";

interface RecorderProps {
  pushAudio: (url: string, text: string) => void;
}
//录音组件
const Recorder = (prop: RecorderProps) => {
  const { pushAudio } = prop;
  //是否录音
  const [isRecord, setIsRecord] = useState(false);
  //实现录音长按
  const pressRef = useRef<any>(null);
  //录音文件
  const [audioSrc, setAudioSrc] = useState("");
  //语音转文字文本
  const [tempText, setTempText] = useState("");
  //网页直接语音转文字
  const recognition = useRef(null);
  //app baidu语音识别
  //录音
  const [recorderManager, setRecorderManager] = useState<any>(null);
  //baidutoken
  const [baiduToken, setBaiduToken] = useState("");

  //语音转文字部署,google需要vpn
  useEffect(() => {
    //初始化打印
    let vConsole = new VConsole();
    // @ts-ignore
    const recorder = plus.audio.getRecorder();
    setRecorderManager(recorder);
  }, []);

  useEffect(() => {}, [tempText]);

  //开始录音
  const recordStart = () => {
    recordMove();
    pressRef.current = setTimeout(() => {
      onStart();
      setIsRecord(true);
    }, 1000);
  };

  //停止录音
  const recordStop = () => {
    recordMove();
    onEnd();
    setIsRecord(false);
  };

  //移动时不录音,清除定时器
  const recordMove = () => {
    pressRef.current && clearTimeout(pressRef.current);
  };

  //baidu语音识别
  const onStart = () => {
    console.log("开始录音");
    recorderManager?.record({}, (recordFile: any) => {
      //录音后的回调函数
      // console.log("录音文件", recordFile);
      setAudioSrc(recordFile);
      Audio2dataURL(recordFile);
    });
  };
  const onEnd = () => {
    console.log("结束录音");
    recorderManager?.stop();
  };
  const onspeechToText = (
    adioFileData: string,
    adioSize: number,
    url: string
  ) => {
    //获取token
    getBaiduToken().then((res: any) => {
      setBaiduToken(res.data.access_token);
      postData(res.data.access_token, adioFileData, adioSize, url);
    });
  };
  const postData = (
    token: string,
    adioFileData: string,
    adioSize: number,
    url: string
  ) => {
    let data = {
      format: "amr", //语音文件的格式，pcm/wav/amr/m4a。不区分大小写。推荐pcm文件
      rate: 8000, //	采样率，16000，固定值 此处文档参数16000，达不到这种高保真音频，故 使用8000
      // dev_pid: 1537,//普通话
      channel: 1, //声道数，仅支持单声道，请填写固定值 1
      cuid: "cuid", //用户唯一标识，用来区分用户，计算UV值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为60字符以内。
      token: token,
      speech: adioFileData, //本地语音文件的的二进制语音数据 ，需要进行base64 编码。与len参数连一起使用。
      len: adioSize, //本地语音文件的的字节数，单位字节 init
    };
    speechRecognition(data).then((res: any) => {
      if (res.data.result[0].length === 0) {
        Toast.show("语音转换识别失败");
        return;
      }
      setTempText(res.data.result[0]);
      pushAudio(url, res.data.result[0]);
    });
  };

  const Audio2dataURL = (url: string) => {
    // @ts-ignore
    plus.io.resolveLocalFileSystemURL(url, (entry: any) => {
      entry.file(
        (file: any) => {
          // @ts-ignore
          let fileReader = new plus.io.FileReader();
          fileReader.onloadend = (e: any) => {
            onspeechToText(
              e.target.result.split(",")[1],
              file.size,
              file.fullPath
            );
          };
          fileReader.readAsDataURL(file);
        },
        (e: any) => {
          Toast.show("读取录音文件错误：" + e.message);
        }
      );
    });
  };

  return (
    <div>
      <FloatingBubble
        axis="xy"
        magnetic="x"
        style={{
          "--initial-position-bottom": "150px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onOffsetChange={recordMove}
      >
        <Button
          shape="rounded"
          onTouchStart={recordStart}
          onTouchEnd={recordStop}
        >
          {isRecord ? (
            <p className={styles.stopRecord}>停止录音</p>
          ) : (
            <AudioFill fontSize={32} />
          )}
        </Button>
      </FloatingBubble>
      <Playbox show={isRecord} />
    </div>
  );
};

export default Recorder;
