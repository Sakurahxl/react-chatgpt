import { login, register } from "@/services/user";
import { Button, Form, Input, NavBar, Image } from "antd-mobile";
import { useEffect, useState } from "react";
import loginImg from "@/assets/login.png";
import registerImg from "@/assets/register.png";
import { history } from "umi";

const LoginApp = () => {
  const [loginForm] = Form.useForm();
  const [registerFrom] = Form.useForm();
  const [isRegister, setIsRegister] = useState(true);
  const onLogin = () => {
    console.log(loginForm.getFieldsValue());
    login(loginForm.getFieldsValue());
  };
  const onRegister = () => {
    let data = registerFrom.getFieldsValue();
    delete data.checkPassword;
    register(data).then((judge) => {
      setIsRegister(judge);
      if (!judge) {
        loginForm.setFieldsValue({
          account: registerFrom.getFieldsValue().account,
          password: registerFrom.getFieldsValue().password,
        });
      }
    });
  };
  const changeForm = () => {
    setIsRegister(!isRegister);
  };
  return (
    <div>
      <div style={{ height: "95vh", backgroundColor: "rgb(244,244,244)" }}>
        <NavBar
          right={
            <p onClick={changeForm}>{isRegister ? "用户登录" : "用户注册"}</p>
          }
          style={{ backgroundColor: "white" }}
          onBack={()=>{history.back();}}
        >
          {isRegister ? "用户注册" : "用户登录"}
        </NavBar>
          <div style={{display:isRegister?"block":"none"}}>
            <Image src={registerImg} />
            <Form
              name="register"
              form={registerFrom}
              onFinish={onRegister}
              layout="horizontal"
              mode="card"
              footer={
                <Button block color="primary" type="submit" size="large">
                  注册
                </Button>
              }
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: "请输入用户名!" }]}
              >
                <Input placeholder="用户名" />
              </Form.Item>
              <Form.Item
                name="account"
                rules={[{ required: true, message: "账号不能为空" }]}
              >
                <Input placeholder="账号" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "密码不能为空" }]}
              >
                <Input placeholder="密码" />
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
                <Input placeholder="确认密码" />
              </Form.Item>
            </Form>
          </div>
          <div style={{display:isRegister?"none":"block"}}>
            <Image src={loginImg} />
            <Form
              name="login"
              form={loginForm}
              onFinish={onLogin}
              layout="horizontal"
              mode="card"
              footer={
                <Button block type="submit" color="primary" size="large">
                  登录
                </Button>
              }
            >
              <Form.Item
                name="account"
                rules={[{ required: true, message: "用户名不能为空" }]}
              >
                <Input placeholder="用户名" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "密码不能为空" }]}
              >
                <Input placeholder="密码" />
              </Form.Item>
            </Form>
          </div>
      </div>
    </div>
  );
};

export default LoginApp;
