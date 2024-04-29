import {
  Avatar,
  Button,
  Card,
  Image,
  List,
  NavBar,
  TextArea,
} from "antd-mobile";
import styles from "./index.less";
import { useEffect, useRef, useState } from "react";
import { getChatHistory, getContactId, initWebSocket } from "@/services/chat";
import ReactMarkdown from "react-markdown";
import { showMessage } from "@/pages/chatgpt";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import facesImg from "@/assets/faces.png";
import photoImg from "@/assets/photo.png";
import { useParams } from "umi";
import { formatDate } from "@/utils/datetime";
import { getLoginStatus } from "@/services/auth";
import { getInfo } from "@/services/user";
import { get } from "node_modules/axios/index.cjs";

type TContent = {
  message: string;
  toUser: string;
  contactId: number;
  sendUser?: string;
  sendTime?: string;
};

const chatWindow = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const messageInput = useRef<any>(null);
  const toUserParams = useParams<{ toUser: string }>();
  const [currentChatHistory, setCurrentChatHistory] = useState<TContent[]>([]);
  //true为电脑端，false为手机端
  const [judgeEnvir, setJudgeEnvir] = useState(true);
  const [value, setValue] = useState("");
  const websocket = useRef<WebSocket | null>(null);
  const [contactId, setContactId] = useState(0);
  const [fromUser, setFromUser] = useState({});
  const [toUser, seToUser] = useState({});

  useEffect(() => {
    getCurrentUserInfo();
    setJudgeEnvir(window.navigator.userAgent.indexOf("Html5Plus") === -1);
    getChatHistoryData();
    getChatStatus();
  }, []);

  const back = () => {
    window.history.back();
  };

  const getChatStatus = async () => {
    let data = await getContactId(toUserParams.toUser ?? "");
    setContactId(data);
  };

  const getChatHistoryData = async () => {
    let data = await getChatHistory(toUserParams.toUser ?? "");
    console.log(data);

    setCurrentChatHistory(data);
  };

  const getCurrentUserInfo = async () => {
    let info = await getInfo({ account: getLoginStatus() });
    websocket.current = initWebSocket(toUserParams.toUser ?? "");
    console.log(info);
    setFromUser(info);
  };

  // 发送消息
  const websocketSend = () => {
    let content: TContent = {
      message: value,
      toUser: toUserParams.toUser ?? "",
      contactId: contactId,
    };
    // 发送消息
    websocket.current?.send(JSON.stringify(content));
    content.sendUser = getLoginStatus();
    content.sendTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    // 添加進去聊天历史列表
    currentChatHistory.push(content);
    setCurrentChatHistory(currentChatHistory);

    // 清空输入内容框
    setValue("");
  };

  //每多一条到底部
  useEffect(() => {
    let content: any = contentRef.current;
    content.scrollTo({ top: content.scrollHeight, behavior: "smooth" });
  }, [currentChatHistory]);

  return (
    <div className={styles["chat-window"]}>
      <NavBar onBack={back}>聊天框</NavBar>
      <div className={styles.content} ref={contentRef}>
        <List
          style={{
            "--align-items": "left",
            "--border-top": "none",
            "--border-bottom": "none",
          }}
        >
          {currentChatHistory.map((item: TContent, index: number) => {
            if (item.toUser === toUserParams.toUser) {
              return (
                <List.Item key={index} prefix={<Avatar src={""} />}>
                  <Card
                    className={styles.card}
                    style={{
                      background: "rgb(149,235,105)",
                      marginLeft: "12px",
                      maxWidth: judgeEnvir ? "50%" : "37vh",
                    }}
                  >
                    <ReactMarkdown
                      children={item.message}
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                    />
                  </Card>
                </List.Item>
              );
            } else if (item.sendUser === "user") {
              return (
                <List.Item
                  key={index}
                  prefix={<Avatar src={""} />}
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
                    {<span>{item.message}&#x200E;</span>}
                  </Card>
                </List.Item>
              );
            }
          })}
        </List>
      </div>
      <div className={styles.footer}>
        <TextArea
          ref={messageInput}
          rows={5}
          placeholder="请输入要发送的消息..."
          value={value}
          onChange={(val) => {
            setValue(val);
          }}
          showCount
          maxLength={500}
          style={{ "--count-text-align": "left" }}
        />
        <a className={styles["chat-faces"]}>
          <Image src={facesImg} />
        </a>
        <a className={styles["chat-img"]}>
          <Image src={photoImg} />
        </a>
        <Button className={styles["chat-send"]} onClick={websocketSend}>
          发送
        </Button>
      </div>
    </div>
  );
};

export default chatWindow;
