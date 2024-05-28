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
import { Fragment, useEffect, useRef, useState } from "react";
import {
  closeWindow,
  getChatHistory,
  getContactId,
  isFirstChat,
} from "@/services/chat";
import facesImg from "@/assets/faces.png";
import photoImg from "@/assets/photo.png";
import { useParams } from "umi";
import { formatDate } from "@/utils/datetime";
import { getLoginStatus } from "@/services/auth";
import { getInfo } from "@/services/user";
import { URL_PREFIX_WS } from "@/services/config";
import kefu from "@/assets/kefu.png";

type TContent = {
  message: string;
  toUser: string;
  contactId: number;
  sendUser?: string;
  sendTime?: string;
};

type TUser = {
  account?: string;
  avatar?: string;
  name?: string;
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
  const [fromUser, setFromUser] = useState<TUser>({});
  const [toUser, setToUser] = useState<TUser>({});
  //断开 重连倒计时
  const timeoutRef: any = useRef(null);

  useEffect(() => {
    checkIsFirstChat();
    return () => {
      websocket.current?.close();
    };
  }, []);

  const back = () => {
    closeWindow();
    window.history.back();
  };

  const checkIsFirstChat = async () => {
    if (!toUserParams.toUser) {
      let fromUser = await getInfo({ account: getLoginStatus() });
      setFromUser(fromUser);
      setToUser({ name: "人工客服", avatar: kefu });
      setCurrentChatHistory([
        {
          message: "欢迎来到人工客服，有什么问题可以问我哦！",
          sendUser: "",
          sendTime: formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
          toUser: getLoginStatus(),
          contactId: 0,
        },
      ]);
      return;
    }
    let data = await isFirstChat(toUserParams.toUser);
    // 如果不是第一次聊天为1
    if (data === 1) {
      getCurrentUserInfo();
      setJudgeEnvir(window.navigator.userAgent.indexOf("Html5Plus") === -1);
      getChatHistoryData();
      getChatStatus();
    }
  };

  const getChatStatus = async () => {
    let data = await getContactId(toUserParams.toUser ?? "");
    setContactId(data);
  };

  const getChatHistoryData = async () => {
    let data = await getChatHistory(toUserParams.toUser ?? "");
    setCurrentChatHistory(data);
  };
  // 建立websocket连接
  const initWebSocket = (toUser: string) => {
    let websocket: WebSocket;
    const target = `${URL_PREFIX_WS}/websocket/${getLoginStatus()}`;
    //判断当前浏览器是否支持WebSocket
    if ("WebSocket" in window) {
      websocket = new WebSocket(target);
    } else {
      console.log("浏览器不支持websocket");
      return null;
    }
    //连接发生错误的回调方法
    websocket.onerror = () => {
      initWebSocket(toUser);
      console.log("连接发生错误！尝试重新连接！");
    };
    //连接关闭的回调方法
    websocket.onclose = () => {
      console.log("关闭连接！");
    };

    //连接成功建立的回调方法
    websocket.onopen = (event) => {
      console.log("连接成功！");
    };

    websocket.onmessage = (event) => {
      let chatContent = JSON.parse(event.data);
      if (chatContent.sendUser == toUser) {
        // 将消息放进去对应的数组中
        // 这里要格式化时间
        chatContent.sendTime = formatDate(
          chatContent.sendTime,
          "yyyy-MM-dd hh:mm:ss"
        );
        setCurrentChatHistory((prevChatHistory) => {
          console.log(prevChatHistory);
          console.log(chatContent);

          // 在这里处理接收到的消息，并返回新的聊天历史数组
          return [...prevChatHistory, chatContent];
        });
      }
    };

    return websocket;
  };

  // 重新连接
  const reconnect = (toUser: string) => {
    let lockReconnect = true; //避免重复连接
    //没连接上会一直重连，设置延迟避免请求过多
    timeoutRef.current && clearTimeout(timeoutRef.current);
    // 如果到了这里断开重连的倒计时还有值的话就清除掉
    timeoutRef.current = setTimeout(() => {
      //然后新连接
      initWebSocket(toUser);
      lockReconnect = false;
    }, 5000);
  };

  const getCurrentUserInfo = async () => {
    let fromUser = await getInfo({ account: getLoginStatus() });
    let toUser = await getInfo({ account: toUserParams.toUser });
    websocket.current = initWebSocket(toUserParams.toUser ?? "");
    setFromUser(fromUser);
    setToUser(toUser);
  };
  useEffect(() => {
    console.log("v", value);
  });

  // 发送消息
  const websocketSend = () => {
    if (!value) {
      return;
    }
    let content: TContent = {
      message: value,
      toUser: toUserParams.toUser ?? "",
      contactId: contactId,
      sendTime: new Date().toISOString(),
    };
    if (toUserParams.toUser) {
      // 发送消息
      websocket.current?.send(JSON.stringify(content));
    }
    content.sendUser = getLoginStatus();
    content.sendTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    // 添加進去聊天历史列表
    setCurrentChatHistory([...currentChatHistory, content]);

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
      <NavBar onBack={back}>{toUser.name}</NavBar>
      <div className={styles.content} ref={contentRef}>
        <List
          style={{
            "--align-items": "left",
            "--border-top": "none",
            "--border-bottom": "none",
          }}
        >
          {currentChatHistory.map((item: TContent, index: number) => {
            let timeDom = (
              <div className={styles["message-time"]}>{item.sendTime}</div>
            );
            if (item.sendUser === toUserParams.toUser || (!toUserParams.toUser && !item.sendUser)) {
              return (
                <Fragment key={index}>
                  {timeDom}
                  <List.Item prefix={<Avatar src={toUser.avatar || ""} />}>
                    <Card
                      className={styles.card}
                      style={{
                        background: "rgb(149,235,105)",
                        marginLeft: "12px",
                        maxWidth: judgeEnvir ? "50%" : "37vh",
                      }}
                    >
                      {<span>{item.message}</span>}
                    </Card>
                  </List.Item>
                </Fragment>
              );
            } else if (item.sendUser === getLoginStatus()) {
              return (
                <Fragment key={index}>
                  {timeDom}
                  <List.Item
                    key={index}
                    prefix={<Avatar src={fromUser.avatar || ""} />}
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
                </Fragment>
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
