import { getTransitionEndName } from "@/utils/compatible";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

/**
 * 弹幕类型
 * RANDOM: 随机位置
 * FIXED: 固定在中间
 */
enum BarrageType {
  RANDOM = 1,
  FIXED,
}

interface BarrageData {
  type: BarrageType;
  color: string;
  content: string;
}

interface BarrageProps {
  fontSize?: string;
  opacity?: number;
  barrages?: BarrageData[];
}

const Barrage = (props: BarrageProps, ref: any) => {
  const barrageRef = useRef<any>();
  const fontSize = useRef<string>(props.fontSize || "0.8rem");
  const opacity = useRef<number>(props.opacity || 1);
  const contentHeight = useRef<number>(0);
  const viewWidth = useRef<number>(0);
  const viewHeight = useRef<number>(0);
  const fixedTop = useRef<number>(0);
  const randomTop = useRef<number>(0);
  const style: any = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  };

  useImperativeHandle(ref, () => ({
    clear: clear,
  }));

  useEffect(() => {
    init();
  }, []);

  const init = () => {
    refresh();
    const div = document.createElement("div");
    div.innerHTML = "div";
    div.style.fontSize = fontSize.current;
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(div);
    // 弹幕内容高度
    contentHeight.current = div.offsetHeight;
    body.removeChild(div);
    const { barrages } = props;
    if (barrages) {
      for (const barrage of barrages) {
        send(barrage);
      }
    }
  };

  /**
   * 刷新弹幕容器宽高
   */
  const refresh = () => {
    const barrageDOM = barrageRef.current;
    // 弹幕区域宽
    viewWidth.current = barrageDOM.offsetWidth;
    // 弹幕区域高
    viewHeight.current = barrageDOM.offsetHeight;
  };

  /**
   * 发送弹幕
   */
  const send = (barrage: BarrageData) => {
    const barrageDOM = barrageRef.current;
    const barrageElem = createBarrageElem(barrage);
    barrageDOM.appendChild(barrageElem);

    if (barrage.type !== BarrageType.FIXED) {
      const x = -(viewWidth.current + barrageElem.offsetWidth);
      setTimeout(() => {
        barrageElem.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
        barrageElem.style.transform = `translate3d(${x}px, 0, 0)`;
      }, 10);
    } else {
      barrageElem.style.left = (viewWidth.current - barrageElem.offsetWidth) / 2 + "px";
      // 移除弹幕
      setTimeout(() => {
        if (barrageElem.parentNode === barrageDOM) {
          barrageDOM.removeChild(barrageElem);

          // 距顶端位置减少一个弹幕内容高度
          let top = fixedTop.current - contentHeight.current;
          fixedTop.current = top;
          if (top < 0) {
            top = 0;
          }
        }
      }, 5000);
    }
  };

  /**
   * 创建弹幕元素
   */
  const createBarrageElem = (barrage: BarrageData) => {
    const div = document.createElement("div");
    div.innerHTML = barrage.content;

    const style: any = {
      position: "absolute",
      fontFamily: "黑体",
      fontSize: "0.8rem",
      fontWeight: "bold",
      whiteSpace: "pre",
      textShadow: "rgb(0, 0, 0) 1px 1px 2px",
      color: barrage.color,
      opacity: opacity.current,
    };
    // 随机滚动
    if (barrage.type !== BarrageType.FIXED) {
      (style.top = `${randomTop.current}px`),
        (style.left = `${viewWidth.current}px`),
        (style.webkitTransition = "-webkit-transform 5s linear 0s");
      style.transition = "transform 5s linear 0s";

      const transitionName = getTransitionEndName(div);
      const handleTransitionEnd = () => {
        // 弹幕运动完成后移除监听，清除弹幕
        if (transitionName) {
          div.removeEventListener(transitionName, handleTransitionEnd);
        }
        barrageRef.current.removeChild(div);

        // 距顶端位置减少一个弹幕内容高度
        let topRemove = randomTop.current - contentHeight.current;
        randomTop.current = topRemove;
        // 最小值边界判断
        if (topRemove < 0) {
          topRemove = 0;
        }
      };
      if (transitionName) {
        div.addEventListener(transitionName, handleTransitionEnd);
      }
      // 距离顶端位置增加一个弹幕内容高度，防止滚动弹幕重叠
      let topAdd = randomTop.current + contentHeight.current;
      randomTop.current = topAdd;
      // 最大值边界判断
      if (topAdd > viewHeight.current - contentHeight.current) {
        topAdd = 0;
      }
    } else {
      div.style.top = fixedTop.current + "px";
      // 距离顶端位置增加一个弹幕内容高度，防止固定弹幕重叠
      let topAdd = fixedTop.current + contentHeight.current;
      fixedTop.current = topAdd;
      // 最大值边界判断
      if (topAdd > viewHeight.current - contentHeight.current) {
        fixedTop.current = 0;
      }
    }

    for (const k in style) {
      if (style[k] !== void 0) {
        div.style[k as any] = style[k];
      }
    }

    return div;
  };

   /**
   * 清除弹幕
   */
   const clear = () => {
    randomTop.current = 0;
    fixedTop.current = 0;
    const barrageDOM = barrageRef.current;
    const children = barrageDOM.children;
    for (const child of Array.from(children)) {
      barrageDOM.removeChild(child);
    }
  }

  return <div style={style} ref={barrageRef} />;
};
export { BarrageType };

export default forwardRef(Barrage);
