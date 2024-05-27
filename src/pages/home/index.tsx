import { Badge, TabBar } from "antd-mobile";
import {
  AppOutline,
  MessageFill,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons";
import { useEffect, useState } from "react";
import styles from "./index.less";
import Personal from "./personal";
import HomePage from "./homePage";
import Todo from "./todo";
import Message from "./message";
import FloatIcon from "@/component/FloatIcon";
import { KeepAlive, useParams } from "umi";

const Home = () => {
  const params = useParams();
  const tabs = [
    {
      key: "home",
      title: "首页",
      icon: <AppOutline />,
      badge: Badge.dot,
    },
    {
      key: "todo",
      title: "历史",
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

  useEffect(() => {
    if (params.go) {
      setActiveKey(tabs[+params.go]?.key??'home');
    }
  }, [params.go]);

  return (
    <div>
      <div className={styles.content}>
        {activeKey === "home" && <HomePage />}
        {activeKey === "todo" && <Todo />}
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
      <FloatIcon />
    </div>
  );
};

export default Home;