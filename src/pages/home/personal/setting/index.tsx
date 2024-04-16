import {
  Button,
  Checkbox,
  Dialog,
  Form,
  ImageUploadItem,
  ImageUploader,
  Input,
  NavBar,
  Space,
  TextArea,
} from "antd-mobile";
import styles from "./index.less";
import { PictureOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { Iuser } from "..";
import { getLoginStatus, getPrompt, setPrompt } from "@/services/auth";
import { getInfo, update, uploadAvatar } from "@/services/user";
import { useLocation } from "umi";

let fileAdress = "";
export async function mockUpload(file: File) {
  uploadAvatar({ file }).then((res) => {
    fileAdress = res;
    return res;
  });
  return {
    url: URL.createObjectURL(file),
  };
}

const Setting = () => {
  const { state } = useLocation();
  const [form] = Form.useForm();
  const [user, setUser] = useState<Iuser>(
    (state as { user?: Iuser })?.user || {
      avatar: "",
      name: "",
      description: "自我描述",
    }
  );
  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    {
      url: user.avatar,
    },
  ]);

  const onSubmit = () => {
    fileList[0].url = fileAdress || fileList[0].url;
    setFileList(fileList);
    const values = form.getFieldsValue();
    console.log(values);
    
    update(values).then((res) => {
      if (res === "Update successfully") {
        Dialog.alert({
          content: <pre>{"修改成功"}</pre>,
        });
      }else{
        Dialog.alert({
          content: <pre>{"修改失败"}</pre>,
        });
      }
    });
    history.go(-1);
  };
  return (
    <div className={styles["setting"]}>
      <NavBar
        onBack={() => {
          history.back();
        }}
        style={{ backgroundColor: "white" }}
      ></NavBar>
      <div className={styles["information"]}>
        <Form
          layout="horizontal"
          form={form}
          footer={
            <Button block color="primary" onClick={onSubmit} size="large">
              提交
            </Button>
          }
          initialValues={{
            avatar: fileList,
            name: user.name,
            description: user.description,
            prompt: user.prompt,
          }}
        >
          <Form.Item name="avatar" label="头像修改" required>
            <ImageUploader
              className={styles["upload"]}
              onChange={setFileList}
              upload={mockUpload}
              maxCount={1}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#999999",
                }}
              >
                <PictureOutline style={{ fontSize: 32 }} />
              </div>
            </ImageUploader>
          </Form.Item>
          <Form.Item name="name" label="名称修改" required>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述修改">
            <TextArea showCount maxLength={30} />
          </Form.Item>
          <Form.Item name="prompt" label="提示词配置">
            <TextArea showCount maxLength={500} autoSize={{ minRows: 5 }} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Setting;
