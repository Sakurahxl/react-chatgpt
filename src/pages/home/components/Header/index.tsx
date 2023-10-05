import styles from "./index.less";
import { Avatar,Image } from "antd";
import logo from "@/assets/logo.png";

interface HeaderProps {
  display: boolean;//是否展示头像
}

const Header = (props: HeaderProps) => {
  return (
    <div className={styles.header}>
      <a className={styles.logo}>
        <Image src={logo} />
      </a>
      {props.display && (
        <a className={styles.avatar}>
          <Avatar
            src={
              "https://img2.baidu.com/it/u=372601434,3534902205&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
            }
          />
        </a>
      )}
      <a className={styles.searchIcon} href="/search">
        <i className="icon-search" />
      </a>
    </div>
  );
};
export default Header;
