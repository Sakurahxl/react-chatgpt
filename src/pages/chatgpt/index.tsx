import React, { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import { send } from "@/services/api";
import {
  Avatar,
  Button,
  Card,
  FloatingBubble,
  Input,
  List,
  TextArea,
  Toast,
} from "antd-mobile";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { AudioFill, RedoOutline } from "antd-mobile-icons";
import AudioAnalyser from "@/component/AudioAnalyser";
import system_prompt from "./systemPrompt";
import 'katex/dist/katex.min.css'

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface showMessage {
  role: "system" | "user" | "assistant";
  content: string;
  type: "text" | "audio";
}

const demoAvatarImages = [
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202108%2F05%2F20210805211949_e77e4.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1693736807&t=673a4f17bead14824eabfa844929af8b",
  "https://img2.baidu.com/it/u=372601434,3534902205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
];

const Chatgpt = () => {
  const textRef = useRef(null);
  const contentRef = useRef(null);
  const sendRef = useRef(null);
  const [isRecord, setIsRecord] = useState(false);
  //传入gpt的内容
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  //展示的聊天内容
  const [showList, setShowList] = useState<showMessage[]>([]);
  const [textareaValue, setTextareaValue] = useState("");
  //直接语音转文字
  const recognition = useRef(null);
  const [tempText, setTempText] = useState("");
  //音频流
  const [status, setStatus] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const audioProps = {
    // audioType,
    // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
    status,
    audioSrc,
    timeslice: 1000, // 时间切片（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
    width: 350,
    backgroundColor: "rgba(0, 0, 0, 0)",
    strokeColor: "rgba(0, 0, 0, 1)",
    startCallback: (e: any) => {
      console.log("succ start", e);
    },
    pauseCallback: (e: any) => {
      console.log("succ pause", e);
    },
    stopCallback: (e: any) => {
      let url = window.URL.createObjectURL(e);
      setAudioSrc(url);
      if(tempText.length === 0) {
        Toast.show("语音转换识别失败");
        return;
      }
      
      let showMessage: showMessage = {
        role: "user",
        content: `transcribe(${tempText}, "${url}")`,
        type: "audio",
      };
      // 添加一条语音
      let requestMessage: ChatMessage = {
        role: "user",
        content: tempText,
      };
      messageList.push(requestMessage);
      showList.push(showMessage);
      requestWithLatestMessage(messageList);
      console.log("succ stop", e);
    },
    onRecordCallback: (e: any) => {
      console.log("recording", e);
    },
    errorCallback: (err: any) => {
      console.log("error", err);
    },
  };

  //放入提示词
  useEffect(() => {
    messageList.push({
      role: "system",
      content: system_prompt,
    });
  }, []);

  //每多一条到底部
  useEffect(() => {
    console.log("showList", showList);

    let content: any = contentRef.current;
    content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });
  }, [showList]);

  //语音转文字部署,google需要vpn
  useEffect(() => {
    console.log("webkitSpeechRecognition" in window);
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
      setIsRecord(false);
    };

    reco.onerror = function () {
      Toast.show("error");
      reco.stop();
    };

    recognition.current = reco;
  }, []);

  const speak = (str: string) => {
    const speakText = new SpeechSynthesisUtterance(str);
    speechSynthesis.speak(speakText);
  };

  //重新提交
  const retryLastFetch = () => {
    if (messageList.length > 0) {
      const lastMessage = messageList[messageList.length - 1];
      if (lastMessage.role === "assistant") {
        setMessageList(messageList.slice(0, -1));
        setShowList(showList.slice(0, -1));
      }
      requestWithLatestMessage(messageList.slice(0, -1));
    }
  };

  const handleButtonClick = async () => {
    const inputValue = textareaValue;
    if (inputValue === "") {
      return Toast.show({
        icon: "fail",
        content: "输入不能为空！！！",
      });
    }
    clearText();
    let requestMessage: ChatMessage = { role: "user", content: inputValue };
    messageList.push(requestMessage);
    let showMessage: showMessage = {
      role: "user",
      content: inputValue,
      type: "text",
    };
    showList.push(showMessage);
    setMessageList([...messageList]);
    setShowList([...showList]);
    requestWithLatestMessage(messageList);
  };

  //控制录音状态
  const controlAudio = (str: string) => {
    setStatus(str);
  };

  const clear = () => {
    clearText();
    setMessageList([]);
    setShowList([]);
  };

  const clearText = () => {
    let text: any = textRef.current;
    text.clear();
  };

  const record = () => {
    let dom: any = document.getElementsByClassName("audioContainer")[0];
    let reco: any = recognition.current;
    if (isRecord) {
      reco.stop();
      controlAudio("inactive");
      dom.style.visibility = "hidden";
    } else {
      reco.start();
      controlAudio("recording");
      dom.style.visibility = "visible";
    }

    setIsRecord(!isRecord);
  };

  const requestWithLatestMessage = async (messageList: ChatMessage[]) => {
    let judgeVoice = (showList.at(-1)?.type === 'audio');
    const { data } = await send(messageList);
    let message = data?.choices[0].message;
    messageList.push(message);
    if (judgeVoice) {
      speak(messageList.at(-1)?.content ?? "");
    }
    console.log("messageList", messageList);
    setMessageList([...messageList]);

    let showMessage: showMessage = {
      role: message.role,
      content: message.content,
      type: "text",
    };
    //解决重新回答异步问题
    let temp: showMessage[] = showList;
    if (showList.length  > messageList.length - 2) {
      temp = showList.slice(0, -1);
    }
    temp.push(showMessage);
    setShowList([...temp]);
  };

  return (
    <div>
      {/* <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css"
        integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn"
        crossOrigin="anonymous"
      /> */}
      <h1 className={styles.title}>山涧晴岚</h1>
      <div className={styles.content} ref={contentRef}>
        <List
          style={{
            "--align-items": "left",
            "--border-top": "none",
            "--border-bottom": "none",
          }}
        >
          {showList.map((item: showMessage, index: number) => {
            if (item.role === "assistant") {
              return (
                <List.Item
                  key={index}
                  prefix={<Avatar src={demoAvatarImages[0]} />}
                >
                  <Card
                    className={styles.card}
                    style={{ background: "rgb(149,235,105)" }}
                  >
                    <ReactMarkdown
                      children={item.content}
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                    />
                  </Card>
                </List.Item>
              );
            } else if (item.role === "user") {
              let judgeVoice = item.type === "audio";
              let str;
              if (judgeVoice) {
                str = item.content.split('"')[1];
              }
              return (
                <List.Item
                  key={index}
                  prefix={<Avatar src={demoAvatarImages[1]} />}
                  style={{ direction: "rtl", textAlign: "end" }}
                >
                  <Card className={styles.card}>
                    {!judgeVoice && item.content}
                    {judgeVoice && str && (
                      <div>
                        <audio
                          controls
                          src={str}
                          id={str.substring(str.length - 6)}
                        />
                      </div>
                    )}
                  </Card>
                </List.Item>
              );
            }
          })}
          {showList.at(-1)?.role === "assistant" && (
            <div className={styles.refresh}>
              <Button
                loading="auto"
                shape="rounded"
                size="mini"
                onClick={retryLastFetch}
              >
                <RedoOutline fontSize={12} />
                刷新回答
              </Button>
            </div>
          )}
        </List>
      </div>
      <div className={styles.inputs}>
        <TextArea
          ref={textRef}
          placeholder="请输入内容"
          value={textareaValue}
          autoSize={{ minRows: 3, maxRows: 3 }}
          onChange={(value: string) => {
            setTextareaValue(value);
          }}
        />
        <div className={styles.buttons}>
          <Button
            color="primary"
            fill="solid"
            onClick={handleButtonClick}
            ref={sendRef}
          >
            发送信息
          </Button>
          <Button color="danger" fill="outline" onClick={clear}>
            清除对话
          </Button>
          <Button color="primary" fill="outline" onClick={clearText}>
            清空文本
          </Button>
        </div>
      </div>
      <FloatingBubble
        axis="xy"
        magnetic="x"
        style={{
          "--initial-position-bottom": "24px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={record}
      >
        {isRecord ? (
          <p className={styles.stopRecord}>停止录音</p>
        ) : (
          <AudioFill fontSize={32} />
        )}
      </FloatingBubble>
      <AudioAnalyser {...audioProps} />
    </div>
  );
};

export default Chatgpt;
