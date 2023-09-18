import { useRef, useState } from "react";
import styles from "./index.less";

const Login = () => {
    const switchCtn = useRef<any>();
    const switchC1 = useRef<any>();
    const switchC2 = useRef<any>();
    const aContainer = useRef<any>();
    const bContainer = useRef<any>();
    //true为注册，false为登录
    const [state,setState] = useState(true);
    const changeForm = () => {
        setState(!state);
    };

  return (
    <div className={styles["login"]}>
      <div className={styles["shell"]}>
        <div
          className={styles["container"] + " " + styles["a-container"] + " " + (state?'':styles["is-txl"])}
        >
          <form action="" method="" className={styles["form"]} id="a-form">
            <h2 className={styles["form_title"] + " " + styles["title"]}>
              创建账号
            </h2>
            {/* <div className={styles["form_icons"]}>
              <i className={styles["iconfont"] + " " + styles["icon-QQ"]}></i>
              <i className={styles["iconfont icon-weixin"]}></i>
              <i className={styles["iconfont icon-bilibili-line"]}></i>
            </div> */}
            <span className={styles["form_span"]}>
              选择注册方式活电子邮箱注册
            </span>
            <input
              type="text"
              className={styles["form_input"]}
              placeholder="Name"
            />
            <input
              type="text"
              className={styles["form_input"]}
              placeholder="Email"
            />
            <input
              type="password"
              className={styles["form_input"]}
              placeholder="Password"
            />
            <button className={styles["form_button"] + " " + styles["button"] + " " + styles["submit"]}>
              SIGN UP
            </button>
          </form>
        </div>

        <div className={styles["container"] + " " + styles["b-container"] + " " + (state?'':(styles['is-txl'] + " " + styles['is-z']))} ref={bContainer}>
          <form action="" method="" className={styles["form"]} id="b-form">
            <h2 className={styles["form_title"] + " " + styles["title"]}>登入账号</h2>
            {/* <div className={styles["form_icons"]}>
              <i className={styles["iconfont icon-QQ"]}></i>
              <i className={styles["iconfont icon-weixin"]}></i>
              <i className={styles["iconfont icon-bilibili-line"]}></i>
            </div> */}
            <span className={styles["form_span"]}>
              选择登录方式活电子邮箱登录
            </span>
            <input
              type="text"
              className={styles["form_input"]}
              placeholder="Email"
            />
            <input
              type="text"
              className={styles["form_input"]}
              placeholder="Password"
            />
            <a className={styles["form_link"]}>忘记密码？</a>
            <button className={styles["form_button"] + " " + styles["button"] +" "+ styles["submit"]}>
              SIGN IN
            </button>
          </form>
        </div>

        <div className={styles["switch"] + " " + (state?'':styles['is-txr'])}>
          <div className={styles["switch_circle"]}></div>
          <div className={styles["switch_circle"] + " " + styles["switch_circle-t"]}></div>
          <div className={styles["switch_container"] + " " + (state?'':styles['is-hidden'])}>
            <h2
              className={styles["switch_title"] + " " + styles["title"]}
              style={{ letterSpacing: 0 }}
            >
              Welcome Back！
            </h2>
            <p className={styles["switch_description"] + " " + styles["description"]}>
              已经有账号了嘛，去登入账号来进入奇妙世界吧！！！
            </p>
            <button className={styles["switch_button"] + " " + styles["button"] + " " + styles["switch-btn"]} onClick={changeForm}>
              SIGN IN
            </button>
          </div>

          <div className={styles["switch_container"] + " " +  " " + (state?styles['is-hidden']:'')}>
            <h2
              className={styles["switch_title"] + " " + styles["title"]}
              style={{ letterSpacing: 0 }}
            >
              Hello Friend！
            </h2>
            <p className={styles["switch_description"] + " " + styles["description"]}>
              去注册一个账号，成为尊贵的粉丝会员，让我们踏入奇妙的旅途！
            </p>
            <button className={styles["switch_button"] + " " + styles["button"] + " " + styles["switch-btn"]}  onClick={changeForm}>
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
