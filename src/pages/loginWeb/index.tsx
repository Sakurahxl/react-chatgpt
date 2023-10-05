import { useState } from "react";
import styles from "./index.less";
import { Button, Form, Input, message } from "antd";
import { login, register } from "@/services/user";

const LoginWeb = () => {
  //true为注册，false为登录
  const [state, setState] = useState(true);
  const [registerFrom] = Form.useForm();
  const [loginFrom] = Form.useForm();
  const changeForm = () => {
    setState(!state);
  };

  const success = () => {
    message.success("注册成功，请登录！");
  };

  const error = () => {
    message.error("注册失败，请重试！");
  };

  const onRegister = () => {
    let data = registerFrom.getFieldsValue();
    delete data.checkPassword;
    register(data).then((judge) => {
      setState(judge);
      if (!judge) {
        success();
        loginFrom.setFieldsValue({
          account: registerFrom.getFieldsValue().account,
          password: registerFrom.getFieldsValue().password,
        });
      } else {
        error();
      }
    });
  };

  const onLogin = () => {
    login(loginFrom.getFieldsValue());
  };

  return (
    <div className={styles["login"]}>
      <div className={styles["shell"]}>
        <div
          className={
            styles["container"] +
            " " +
            styles["a-container"] +
            " " +
            (state ? "" : styles["is-txl"])
          }
        >
          <Form
            name="register"
            form={registerFrom}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onRegister}
            autoComplete="off"
          >
            <h2 className={styles["title"]}>创建账号</h2>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item
              name="account"
              rules={[{ required: true, message: "请输入账号!" }]}
            >
              <Input placeholder="账号" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password
                placeholder="密码"
                iconRender={(visible) => <div />}
              />
            </Form.Item>
            <Form.Item
              name="checkPassword"
              rules={[
                { required: true, message: "请确认密码!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("前后密码不一致!"));
                  },
                }),
              ]}
              dependencies={["password"]} //依赖password
            >
              <Input.Password placeholder="确认密码" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
              <Button type="primary" htmlType="submit">
                SIGN UP
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div
          className={
            styles["container"] +
            " " +
            styles["b-container"] +
            " " +
            (state ? "" : styles["is-txl"] + " " + styles["is-z"])
          }
        >
          <Form
            name="login"
            form={loginFrom}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onLogin}
            autoComplete="off"
          >
            <h2 className={styles["title"]}>登入账号</h2>
            <Form.Item
              name="account"
              rules={[{ required: true, message: "请输入账号!" }]}
            >
              <Input placeholder="账号" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password placeholder="密码" />
            </Form.Item>
            <a className={styles["form_link"]}>忘记密码？</a>
            <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
              <Button type="primary" htmlType="submit">
                SIGN IN
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div
          className={styles["switch"] + " " + (state ? "" : styles["is-txr"])}
        >
          <div className={styles["switch_circle"]}></div>
          <div
            className={
              styles["switch_circle"] + " " + styles["switch_circle-t"]
            }
          ></div>
          <div
            className={
              styles["switch_container"] +
              " " +
              (state ? "" : styles["is-hidden"])
            }
          >
            <h2
              className={styles["switch_title"] + " " + styles["title"]}
              style={{ letterSpacing: 0 }}
            >
              Welcome Back！
            </h2>
            <p
              className={
                styles["switch_description"] + " " + styles["description"]
              }
            >
              已经有账号了嘛，去登入账号来进入奇妙世界吧！！！
            </p>
            <Button
              type="primary"
              className={styles["switch_button"]}
              onClick={changeForm}
            >
              SIGN IN
            </Button>
          </div>

          <div
            className={
              styles["switch_container"] +
              " " +
              (state ? styles["is-hidden"] : "")
            }
          >
            <h2
              className={styles["switch_title"] + " " + styles["title"]}
              style={{ letterSpacing: 0 }}
            >
              Hello Friend！
            </h2>
            <p
              className={
                styles["switch_description"] + " " + styles["description"]
              }
            >
              去注册一个账号，让我们踏入奇妙的旅途！
            </p>
            <Button
              type="primary"
              className={styles["switch_button"]}
              onClick={changeForm}
            >
              SIGN UP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginWeb;
