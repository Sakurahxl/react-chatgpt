import styles from "./index.less";
import { Avatar, Image } from "antd";
import logo from "@/assets/logo.png";
import { getLoginStatus } from "@/services/auth";
import { getInfo } from "@/services/user";
import { useEffect, useState } from "react";

interface HeaderProps {
  display: boolean; //是否展示头像
}

const Header = (props: HeaderProps) => {
  const [userAvatar, setUserAvatar] = useState<string>("");
  useEffect(() => {
    getInfo({ account: getLoginStatus() }).then((res) => {
      setUserAvatar(res.avatar??"https://img2.baidu.com/it/u=372601434,3534902205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500");
    });
  }, []);
  return (
    <div className={styles.header}>
      <a className={styles.logo}>
        <Image src={logo} preview={false} />
      </a>
      {props.display && (
        <a className={styles.avatar}>
          <Avatar src={userAvatar} />
        </a>
      )}
      <a className={styles.searchIcon} href="/search">
        <i className="icon-search" />
      </a>
    </div>
  );
};
export default Header;
