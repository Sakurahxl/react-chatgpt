import { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import { send } from "@/services/api";
import {
  Avatar,
  Button,
  Card,
  DotLoading,
  List,
  NavBar,
  TextArea,
  Toast,
} from "antd-mobile";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { RedoOutline } from "antd-mobile-icons";
import "katex/dist/katex.min.css";
import Recorder from "./components/Recorder";
import VoiceBar from "./components/VoiceBar";
import { history, KeepAlive } from "umi";
import RecorderWeb from "./components/RecorderWeb";
import { getInfo } from "@/services/user";
import { getLoginStatus, getPrompt, getUnload } from "@/services/auth";
import jumpPage from "./jumpPage";

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
];

enum Type {
  AUTOOLD = "/autoOld",
  LOGIN = "/",
  TESTPAGE = "/testPage",
}

const Chatgpt = (props: any) => {
  const textRef = useRef(null);
  const contentRef = useRef(null);
  const sendRef = useRef(null);
  //传入gpt的内容
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);
  //展示的聊天内容
  const [showList, setShowList] = useState<showMessage[]>([]);
  //输入框内容
  const [textareaValue, setTextareaValue] = useState("");
  //加载状态判断
  const [loading, setLoading] = useState(false);
  //true为电脑端，false为手机端
  const [judgeEnvir, setJudgeEnvir] = useState(true);
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    getInfo({ account: getLoginStatus() }).then((res) => {
      setUserAvatar(res.avatar??"https://img2.baidu.com/it/u=372601434,3534902205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500");
    });
  }, []);

  //放入提示词
  useEffect(() => {
    setJudgeEnvir(window.navigator.userAgent.indexOf("Html5Plus") === -1);
    messageList.push({
      role: "system",
      content: getPrompt(),
    });
  }, []);

  //每多一条到底部
  useEffect(() => {
    console.log("showList", showList);
    let content: any = contentRef.current;
    content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });
  }, [showList]);

  //文字转语音
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

  //发送信息
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

  //清空记录
  const clear = () => {
    clearText();
    //第一条系统提示词不清除
    setMessageList(messageList.slice(0, 1));
    setShowList([]);
  };

  //清空文本框
  const clearText = () => {
    let text: any = textRef.current;
    text.clear();
  };

  //请求gpt
  const requestWithLatestMessage = async (messageList: ChatMessage[]) => {
    setLoading(true);
    let judgeVoice = showList.at(-1)?.type === "audio";
    const { data } = await send(messageList);
    setLoading(false);
    if (!data) {
      Toast.show("获取答复失败");
      return;
    }
    let message = data?.choices[0].message;
    messageList.push(message);
    // if (judgeVoice) {
    //   speak(messageList.at(-1)?.content ?? "");
    // }
    // console.log("messageList", messageList);
    setMessageList([...messageList]);

    let showMessage: showMessage = {
      role: message.role,
      content: message.content,
      type: "text",
    };
    //解决重新回答异步问题
    let temp: showMessage[] = showList;
    if (showList.length > messageList.length - 2) {
      temp = showList.slice(0, -1);
    }
    temp.push(showMessage);
    setShowList([...temp]);
    commandToJump(message);
  };

  const commandToJump = (message: any) => {
    if (message.content.includes("跳转")) {
      let url = message.content.split("跳转到")[1];
      url = url.split("页面")[0];
      Toast.show("5s后即将跳转到" + url + "页面");
      setTimeout(() => {
        jumpPage.filter((item) => {
          item.name === url;
          return history.push(item.path);
        });
      }, 5000);
    }
  };

  //放入语音文件
  const pushAudio = (url: string, tempText: string) => {
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
    setMessageList([...messageList]);
    setShowList([...showList]);
    requestWithLatestMessage(messageList);
  };

  //播放
  const playVoice = (audioSrc: string) => {
    if (audioSrc) {
      // @ts-ignore
      plus.audio.createPlayer(audioSrc).play();
    }
  };

  //返回
  const turnBack = () => {
    // @ts-ignore
    // self.location=document.referrer;
    history.back();
  };

  return (
    <div className={styles["chatgpt"]}>
      {/* <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css"
        integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn"
        crossOrigin="anonymous"
      /> */}
      <NavBar onBack={turnBack} style={{ backgroundColor: "white" }}>
        山涧晴岚
      </NavBar>
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
                    style={{
                      background: "rgb(149,235,105)",
                      marginLeft: "12px",
                      maxWidth: judgeEnvir ? "50%" : "37vh",
                    }}
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
              let audioSrc: string = "";
              let content: string = "";
              if (judgeVoice) {
                audioSrc = item.content.split('"')[1];
                content = item.content.split("(")[1];
                content = content.split(",")[0];
              }
              return (
                <List.Item
                  key={index}
                  prefix={<Avatar src={userAvatar} />}
                  style={{ direction: "rtl", textAlign: "end" }}
                >
                  <Card
                    className={styles.card}
                    style={{
                      marginRight: "12px",
                      maxWidth: judgeEnvir ? "50%" : "37vh",
                    }}
                  >
                    {/* 解决符号在文字左边 */}
                    {!judgeVoice && <span>{item.content}&#x200E;</span>}
                    {judgeVoice && (
                      <div>
                        {audioSrc &&
                          (judgeEnvir ? (
                            <div style={{ direction: "ltr", display: "grid" }}>
                              {content}&#x200E;
                              <audio
                                controls
                                src={audioSrc}
                                id={audioSrc.substring(audioSrc.length - 6)}
                              />
                            </div>
                          ) : (
                            <div>
                              {content}&#x200E;
                              <VoiceBar url={audioSrc} />
                            </div>
                          ))}
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
        {loading && (
          <div style={{ textAlign: "center" }}>
            回答中
            <DotLoading />
          </div>
        )}
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
          {judgeEnvir ? (
            <RecorderWeb pushAudio={pushAudio} />
          ) : (
            <Recorder pushAudio={pushAudio} />
          )}
        </div>
      </div>
    </div>
  );
};

export default () => {
  useEffect(() => {
    const judge = getUnload();
    if (judge === "true") {
      location.reload();
    }
  }, []);
  return (
    <>
      <KeepAlive
        name="chatgpt"
        // achekey={judgeUnload}
        // when={() => {
        /*根据路由的前进和后退状态去判断页面是否需要缓存，前进时缓存，后退时不缓存（卸载）。 when中的代码是在页面离开（卸载）时触发的。*/
        // return history.action !== 'POP';
        // }}
        saveScrollPosition="screen"
        when={true}
      >
        <Chatgpt />
      </KeepAlive>
    </>
  );
};
