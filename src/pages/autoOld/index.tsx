import { useState } from "react";
import styles from "./index.less";
import Content  from "./components/content";
const AutoOld = () => {
  const [isOld, setIsOld] = useState(true);
  const change = () => {
    let autoOld = document.documentElement.style;
    if (isOld) {
      autoOld.setProperty(`--font-size`, "20px");
      autoOld.setProperty(`--background-color`, "#fffff");
      autoOld.setProperty(`--text-color`, "#000000");
      autoOld.setProperty(`--button-padding`, "10px 20px");
      autoOld.setProperty(`--button-border`, "#ffffff");
      autoOld.setProperty(`--button-hover-background`, "#eeeeee");
    } else {
      autoOld.setProperty(`--font-size`, "12px");
      autoOld.setProperty(`--background-color`, "#FEDFE1");
    }
    setIsOld(!isOld);
  };
  return (
    <div className={styles["box"]}>
      <h1>适老化页面示例</h1>

      <button onClick={change}>点击我进行适老化</button>

      <p>这是一个适合老年人的H5页面示例。</p>
      <Content />
    </div>
  );
};

export default AutoOld;
