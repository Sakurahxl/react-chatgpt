import styles from "./index.less";
import { Avatar, Image } from "antd";
import logo from "@/assets/logo.png";
import { getLoginStatus } from "@/services/auth";
import { getInfo } from "@/services/user";
import { useEffect, useState } from "react";
import { SearchOutline } from "antd-mobile-icons";
import { history } from "umi";

interface HeaderProps {
  display: boolean; //是否展示头像
  search?: boolean; //是否展示搜索框
}

const Header = (props: HeaderProps) => {
  const [userAvatar, setUserAvatar] = useState<string>("");
  useEffect(() => {
    getInfo({ account: getLoginStatus() });
    setUserAvatar(sessionStorage.getItem("userAvatar")??"https://img2.baidu.com/it/u=372601434,3534902205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500");
  }, []);

  const handleSearch = () => {
    history.push("/search");
  };
  return (
    <div className={styles.header}>
      <a className={styles.logo}>
        <Image src={logo} preview={false} />
      </a>
      {
        props?.search && <span className={styles.search}><SearchOutline fontSize={20} onClick={handleSearch}/></span>
      }
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
