import { Button, Form, Input } from "antd-mobile";
import { history } from "umi";
import loginImg from "@/assets/login.gif";

export default function HomePage() {
  const [form] = Form.useForm();
  const toGpt = () => {
    history.push("/chatgpt");
  };
  return (
    <div>
      <div>
        <Form
          name="form"
          form={form}
          onFinish={toGpt}
          footer={
            <Button block type="submit" color="primary" size="large">
              登录gpt
            </Button>
          }
        >
          <Form.Header>登录界面</Form.Header>
          <Form.Item name="name" label="用户名" >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="address" label="密码"  help="数字加字母">
            <Input placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </div>
      {/* <img style={{height:"300px",width:"100%"}} src={loginImg}/> */}
    </div>
  );
}
