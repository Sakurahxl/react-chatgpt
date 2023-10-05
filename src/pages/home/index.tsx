import { Badge, FloatingBubble, TabBar } from "antd-mobile";
import {
  AppOutline,
  MessageFill,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons";
import { useState } from "react";
import styles from "./index.less";
import Personal from "./personal";
import { history } from "umi";
import loginImg from "@/assets/login.gif";
import HomePage from "./homePage";
import Todo from "./todo";
import Message from "./message";

const Home = () => {
  const tabs = [
    {
      key: "home",
      title: "首页",
      icon: <AppOutline />,
      badge: Badge.dot,
    },
    {
      key: "todo",
      title: "待办",
      icon: <UnorderedListOutline />,
      badge: "5",
    },
    {
      key: "message",
      title: "消息",
      icon: (active: boolean) =>
        active ? <MessageFill /> : <MessageOutline />,
      badge: "99+",
    },
    {
      key: "personal",
      title: "我的",
      icon: <UserOutline />,
    },
  ];

  const [activeKey, setActiveKey] = useState("home");

  return (
    <div>
      <div className={styles.content}>
        {activeKey === "home" && <HomePage />}
        {activeKey === "todo" && <Todo/>}
        {activeKey === "message" && <Message />}
        {activeKey === "personal" && <Personal />}
      </div>
      <TabBar
        onChange={setActiveKey}
        activeKey={activeKey}
        className={styles.tabBar}
      >
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
      <FloatingBubble
        axis="xy"
        magnetic="x"
        style={{
          "--initial-position-bottom": "150px",
          "--initial-position-right": "24px",
          "--edge-distance": "24px",
        }}
        onClick={() => {
          history.push("/chatgpt");
        }}
      >
        <img style={{ width: "100%" }} src={loginImg} />
      </FloatingBubble>
    </div>
  );
};
export default Home;
