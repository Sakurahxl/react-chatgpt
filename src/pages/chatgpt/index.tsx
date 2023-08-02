import React, { useEffect, useRef, useState } from "react";
import styles from "./index.less";
import { send } from "@/services/api";
import { Button, Input, List, TextArea } from "antd-mobile";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const Chatgpt = () => {
  const inputRef = useRef("");
  const textRef = useRef();
  const [messageList, setMessageList] = useState<ChatMessage[]>([]);

  useEffect(() => {
    console.log(messageList);
  }, [messageList]);

  const handleButtonClick = async () => {
    const inputValue = inputRef.current;
    let text: any = textRef.current;
    text.clear();
    let requestMessage: ChatMessage = { role: "user", content: inputValue };
    messageList.push(requestMessage);
    setMessageList([...messageList]);
    const { data } = await send(messageList);
    console.log(data);
    messageList.push(data?.choices[0].message);
    console.log("mmm", messageList);
    setMessageList([...messageList]);
  };

  const requestWithLatestMessage = async () => {};

  return (
    <div>
      <h1 className={styles.title}>Page chatgpt</h1>
      <div>
        <List header="基础用法">
          {messageList.map((item: ChatMessage, index: number) => {
            return <List.Item key={index}>{item.content}</List.Item>;
          })}
        </List>
      </div>
      <div>
        <TextArea
          ref={textRef}
          placeholder="请输入内容"
          autoSize={{ minRows: 3, maxRows: 5 }}
          onChange={(value: string) => {
            inputRef.current = value;
          }}
        />
        <Button color="primary" fill="solid" onClick={handleButtonClick}>
          发送信息
        </Button>
      </div>
    </div>
  );
};

export default Chatgpt;
