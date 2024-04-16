import { Input, NavBar } from "antd-mobile";
import styles from "./index.less";

const chatWindow = () => {
  const back = () => {
    window.history.back();
  };
  return (
    <div className={styles["chat-window"]}>
      <NavBar onBack={back}>聊天框</NavBar>
      <div className={styles.content}>
        <div></div>
      </div>
      <div className={styles.footer}>
        <img src="img/hua.png" alt="" />
        <label>
          <input type="file" name="img" id="sendimg" />
          <img src="img/images.png" alt="" />
        </label>
        <Input
          placeholder='请输入内容'
        //   value={value}
        //   onChange={val => {
        //     setValue(val)
        //   }}
        />
        <p>发送</p>
      </div>
    </div>
  );
};

export default chatWindow;
