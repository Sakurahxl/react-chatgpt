import { FloatButton } from "antd";
import { FloatingBubble } from "antd-mobile";
import { AudioOutline } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { history } from "umi";

const FloatIcon = () => {
  //true为电脑端，false为手机端
  const [judgeEnvir, setJudgeEnvir] = useState(true);

  useEffect(() => {
    setJudgeEnvir(window.navigator.userAgent.indexOf("Html5Plus") === -1);
  }, []);

  return (
    <>
      {judgeEnvir ? (
        <FloatButton
          shape="circle"
          type="primary"
          style={{ right: 80, bottom: 80 }}
          icon={<AudioOutline />}
          onClick={() => {
            history.push("/chatgpt");
          }}
        />
      ) : (
        <FloatingBubble
          axis="xy"
          magnetic="x"
          style={{
            "--initial-position-bottom": "150px",
            "--initial-position-right": "24px",
            "--edge-distance": "24px",
          }}
          onClick={() => {
            history.push("/chatgpt");
          }}
        >
          {/* <img style={{ width: "100%" }} src={loginImg} /> */}
          <p>AI客服</p>
        </FloatingBubble>
      )}
    </>
  );
};

export default FloatIcon;
