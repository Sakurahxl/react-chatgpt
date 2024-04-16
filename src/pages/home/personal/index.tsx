import styles from "./index.less";
import { Avatar, Button, Card, Col, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import { getLoginStatus, getLogout } from "@/services/auth";
import { getInfo, logon } from "@/services/user";
import { useNavigate } from "umi";
import system_prompt from "@/pages/chatgpt/systemPrompt";
import { Modal, Input } from "antd-mobile";

export interface Iuser {
  avatar: string;
  name: string;
  description?: string;
  prompt?: string;
}

const Personal = () => {
  const personalRef = useRef<any>(null);
  const [user, setUser] = useState<Iuser>({
    avatar: "",
    name: "",
    description: "",
    prompt: "",
  });
  const navigator = useNavigate();
  useEffect(() => {
    personalRef.current.scrollIntoView(true);
    getInfo({ account: getLoginStatus() }).then((res) => {
      setUser({
        avatar:
          res.avatar ??
          "https://img2.baidu.com/it/u=372601434,3534902205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        name: res.name,
        description: res.description ?? "自我描述",
        prompt: res.prompt ?? system_prompt,
      });
    });
  }, []);

  const setting = () => {
    navigator("/home/personal/setting", {
      state: {
        user,
      },
    });
  };

  const getLogon = () => {
    let password = "";
    Modal.confirm({
      content: (
        <>
          <h6 className={styles['confirm-title']}>注销账号后，您的账号将无法再次登录，是否继续？</h6>
          <div>
            <span className={styles['confirm-content']}>确认密码</span>
            <Input
              placeholder="请输入密码"
              clearable
              type="password"
              onChange={(value) => {
                password = value;
              }}
            />
          </div>
        </>
      ),
      onConfirm: async () => {
        logon({ account: getLoginStatus(), password: password });
      },
    });
  };
  return (
    <div className={styles.personal} ref={personalRef}>
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
                <p className={styles.description}>{user.description}</p>
              </Row>
            </Col>
            <Col span={6} className={styles.btn}>
              <Button type="primary" shape="round" onClick={setting}>
                设置
              </Button>
            </Col>
          </Row>
        </Card>
        <Card className={styles.card} style={{ minHeight: "400px" }}>
          <div>
            <h3>ai客服助手个性化词</h3>
            <p>{user.prompt}</p>
          </div>
        </Card>
        <Card className={styles.card}>
          <div>
            <Button
              type="primary"
              shape="round"
              style={{ width: "100%", marginBottom: "20px" }}
            >
              联系人工客服
            </Button>
            <Button
              type="primary"
              shape="round"
              onClick={() => getLogout()}
              style={{ width: "100%", marginBottom: "20px" }}
            >
              登出
            </Button>
            <Button
              type="primary"
              shape="round"
              style={{ width: "100%" }}
              onClick={() => getLogon()}
            >
              注销账号
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Personal;
