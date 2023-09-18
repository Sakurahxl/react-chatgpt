
import { login } from "@/services/user";
import { Button, Form, Input } from "antd-mobile";



export default function HomePage() {
  const [form] = Form.useForm();
  const toGpt = () => {
   login(form.getFieldsValue());
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
              登录
            </Button>
          }
        >
          <Form.Header>登录界面</Form.Header>
          <Form.Item name="account" label="用户名" rules={[{ required: true, message: '用户名不能为空' }]} >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, message: '密码不能为空' }]} help="数字加字母">
            <Input placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
