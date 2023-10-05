import { NavBar } from "antd-mobile";
import styles from "./index.less";
import { Avatar, Button, Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { getLoginStatus, getLogout } from "@/services/auth";
import { getInfo } from "@/services/user";
import system_prompt from "@/pages/chatgpt/systemPrompt";

interface Iuser {
  avatar: string;
  name: string;
}

const Personal = () => {
  const [user,setUser] = useState<Iuser>({
    avatar: "https://img2.baidu.com/it/u=372601434,3534902205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
    name: "Sakura",
  });
  useEffect(() => {
    getInfo({ account: getLoginStatus()}).then((res) => {
      setUser({
        avatar: res.avatar,
        name: res.name,
      })
    });
  }, []);
  return (
    <div className={styles.personal}>
      <div className={styles.information}>
        <Card className={styles.card}>
          <Row>
            <Col span={6}>
              <Avatar
                // size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                size={100}
                src={user.avatar}
              />
            </Col>
            <Col span={12}>
              <Row>
                <p className={styles.title}> {user.name}</p>
              </Row>
              <Row>
                <p className={styles.description}>自我描述</p>
              </Row>
            </Col>
            <Col span={6} className={styles.btn}>
              <Button
                type="primary"
                shape="round"
              >
                设置
              </Button>
            </Col>
          </Row>
        </Card>
        <Card className={styles.card}>
          <div>
            <h3>ai客服助手个性化词</h3>
            <p style={{height: "400px"}}>{system_prompt}</p>
            <Button
                type="primary"
                shape="round"
                style={{width:"100%",marginBottom:"20px"}}
              >
                联系人工客服
            </Button>
            <Button
                type="primary"
                shape="round"
                onClick={() => getLogout()}
                style={{width:"100%"}}
              >
                登出
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Personal;
