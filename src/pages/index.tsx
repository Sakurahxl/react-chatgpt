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
      kongbai
    </div>
  );
}
