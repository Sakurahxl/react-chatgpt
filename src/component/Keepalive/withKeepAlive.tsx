import { useContext, useEffect, useRef } from "react"
import CacheContext from "./CacheContext";
import * as cacheTypes from "./cacheTypes";


const withKeepAlive = (
    OldComponent: any,
    { cacheId = window.location.pathname, scroll = false }
) => {
    return function (props: any) {
        const { mount, cacheStates, dispatch, handleScroll }:any = useContext(CacheContext);
        const ref = useRef<any>(null);
        useEffect(() => {
            if (scroll) {
              // scroll = true, 监听缓存组件的滚动事件，调用handleScroll()缓存滚动条
              ref.current.addEventListener(
                "scroll",
                handleScroll.bind(null, cacheId),
                true
              );
            }
          }, [handleScroll]);
          useEffect(() => {
            let cacheState = cacheStates[cacheId];
            if (
              cacheState &&
              cacheState.doms &&
              cacheState.status !== cacheTypes.DESTROY
            ) {
              // 如果真实dom已经存在，且状态不是DESTROY，则用当前的真实dom
              let doms = cacheState.doms;
              doms.forEach((dom: any) => ref.current.appendChild(dom));
              if (scroll) {
                // 如果scroll = true, 则将缓存中的scrollTop拿出来赋值给当前dom
                doms.forEach((dom: any) => {
                  if (cacheState.scrolls[dom])
                    dom.scrollTop = cacheState.scrolls[dom];
                });
              }
            } else {
              // 如果还没产生真实dom，派发生成
              mount({
                cacheId,
                element: <OldComponent {...props} dispatch={dispatch} />,
              });
            }
          }, [cacheStates, dispatch, mount, props]);
          return (<div id={`keepalive_${cacheId}`} ref={ref} />);
    };
}

export default withKeepAlive;