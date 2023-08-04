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

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
const demoAvatarImages = [
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202108%2F05%2F20210805211949_e77e4.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1693736807&t=673a4f17bead14824eabfa844929af8b",
  "https://img2.baidu.com/it/u=372601434,3534902205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
  ];

const Chatgpt = () => {
  const inputRef = useRef("");
  const textRef = useRef();
  const contentRef = useRef();
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);

  useEffect(() => {
    console.log(messageList);
    let content: any = contentRef.current;
    content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });
  }, [messageList]);

  //重新提交
  const retryLastFetch = () => {
    if (messageList.length > 0) {
      const lastMessage = messageList[messageList.length - 1]
      if (lastMessage.role === 'assistant')
        setMessageList(messageList.slice(0, -1));
      requestWithLatestMessage(messageList.slice(0, -1));
    }
  };

  const handleButtonClick = async () => {
    const inputValue = inputRef.current;
    if (inputValue === "") {
      return Toast.show({
        icon: "fail",
        content: "输入不能为空！！！",
      });
    }
    clearText();
    let requestMessage: ChatMessage = { role: "user", content: inputValue };
    messageList.push(requestMessage);
    setMessageList([...messageList]);
    requestWithLatestMessage(messageList);
  };

  const clear = () => {
    clearText();
    setMessageList([]);
  };

  const clearText = () => {
    let text: any = textRef.current;
    text.clear();
  };

  const requestWithLatestMessage = async (messageList:ChatMessage[]) => {
    const { data } = await send(messageList);
    console.log(data);
    messageList.push(data?.choices[0].message);
    console.log("mmm", messageList);
    setMessageList([...messageList]);
  };

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css"
        integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn"
        crossOrigin="anonymous"
      />
      <h1 className={styles.title}>Page chatgpt</h1>
      <div className={styles.content} ref={contentRef}>
        <List
          style={{
            "--align-items": "left",
            "--border-top": "none",
            "--border-bottom": "none",
          }}
        >
          {messageList.map((item: ChatMessage, index: number) => {
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
            } else {
              return (
                <List.Item
                  key={index}
                  prefix={<Avatar src={demoAvatarImages[1]} />}
                  style={{ direction: "rtl", textAlign: "end" }}
                >
                  <Card className={styles.card}>{item.content}</Card>
                </List.Item>
              );
            }
          })}
          {messageList.at(-1)?.role === "assistant" && (
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
          autoSize={{ minRows: 3, maxRows: 3 }}
          onChange={(value: string) => {
            inputRef.current = value;
          }}
        />
        <div className={styles.buttons}>
          <Button color="primary" fill="solid" onClick={handleButtonClick}>
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
        axis='xy'
        magnetic='x'
        style={{
          '--initial-position-bottom': '24px',
          '--initial-position-right': '24px',
          '--edge-distance': '24px',
        }}
      >
        <AudioFill fontSize={32}/>
      </FloatingBubble>
    </div>
  );
};

export default Chatgpt;
