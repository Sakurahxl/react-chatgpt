import React, { useEffect, useState } from "react";
import styles from "./index.less";
import Header from "../components/Header";
import storage, { ViewHistory } from "@/utils/storage";
import { formatDate } from "@/utils/datetime";
import { getViewRecord } from "@/services/history";

const TodoApp = () => {
  const [histories, setHistories] = useState<Array<[string, ViewHistory[]]>>(
    []
  );

  useEffect(() => {
    const viewHistories = storage.getViewHistory();
    getViewRecord().then((result: any) => {
      console.log("history",result);
    });

    // 按点击时间排序
    viewHistories.sort(
      (a: { viewAt: number }, b: { viewAt: number }) => b.viewAt - a.viewAt
    );

    // 按时间点（今天，昨天，更早） 分组
    const historyMap: Map<string, ViewHistory[]> = new Map();
    viewHistories.forEach((history: ViewHistory) => {
      const key = getDateKey(history.viewAt);
      let histories = historyMap.get(key);
      if (histories) {
        histories.push(history);
      } else {
        histories = new Array();
        histories.push(history);
        historyMap.set(key, histories);
      }
    });
    setHistories([...historyMap]);
  }, []);

  // 获取相对时间
  const getDateKey = (timestamp: number) => {
    const currentTime = new Date();
    const dateTime = new Date(timestamp);
    if (
      currentTime.getFullYear() === dateTime.getFullYear() &&
      currentTime.getMonth() === dateTime.getMonth()
    ) {
      const diffDate = currentTime.getDate() - dateTime.getDate();
      switch (diffDate) {
        case 0:
          return "今天";
        case 1:
          return "昨天";
        case 2:
          return "前天";
        default:
          return "更早";
      }
    } else {
      return "更早";
    }
  };

  // 获取观看具体时间
  const getTime = (timestamp: number) => {
    const currentTime = new Date();
    const dateTime = new Date(timestamp);
    if (
      currentTime.getFullYear() === dateTime.getFullYear() &&
      currentTime.getMonth() === dateTime.getMonth()
    ) {
      const diffDate = currentTime.getDate() - dateTime.getDate();
      switch (diffDate) {
        case 0:
          return "今天 " + formatDate(dateTime, "hh:mm");
        case 1:
          return "昨天 " + formatDate(dateTime, "hh:mm");
        case 2:
          return "前天 " + formatDate(dateTime, "hh:mm");
        default:
          return formatDate(dateTime, "yyyy-MM-dd hh:mm");
      }
    } else {
      return formatDate(dateTime, "yyyy-MM-dd hh:mm");
    }
  };

  return (
    <div className={styles.todo}>
      {/* 图片不显示加入下行代码，跳过安全url认证 */}
      <meta name="referrer" content="no-referrer" />
      <div className={styles["top-wrapper"]}>
        <Header display={true} />
      </div>
      <h1>历史记录</h1>
      <div className={styles.history}>
        {histories.map((item: Array<any>, i: number) => (
          <div className={styles["history-item"]} key={i}>
            <div className={styles["item-title"]}>{item[0]}</div>
            {item[1].map((history: ViewHistory) => (
              <div className={styles["item-wrapper"]} key={history.aId}>
                <a href={"#/home/video/av" + history.aId}>
                  <div className={styles["img-container"]}>
                    <img src={history.pic} />
                  </div>
                  <div className={styles.info}>
                    <div className={styles.title}>{history.title}</div>
                    <div className={styles.time}>{getTime(history.viewAt)}</div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ))}
        {histories.length === 0 ? (
          <div className={styles.tips}>
            {/* <img src={tips} /> */}
            <div className={styles.text}>你还没有历史记录</div>
            <div className={styles.text}>
              快去发现&nbsp;<a href="/index">新内容</a>&nbsp;吧！
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TodoApp;
