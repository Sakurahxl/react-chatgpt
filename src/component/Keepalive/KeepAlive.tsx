import { useCallback, useReducer } from "react";
import cacheReducer from "./cacheReducer";
import CacheContext from "./CacheContext";
import * as cacheTypes from "./cacheTypes";
import React from "react";

const KeepAlive = (props:any) => {
  let [cacheStates, dispatch] = useReducer(cacheReducer, {});
  const mount = useCallback(
    ({ cacheId, element }: any) => {
      // 挂载元素方法，提供子组件调用挂载元素
      if (cacheStates[cacheId]) {
        let cacheState = cacheStates[cacheId];
        if (cacheState.status === cacheTypes.DESTROY) {
          let doms = cacheState.doms;
          doms.forEach((dom: any) => dom.parentNode.removeChild(dom));
          dispatch({ type: cacheTypes.CREATE, payload: { cacheId, element } }); // 创建缓存
        }
      } else {
        dispatch({ type: cacheTypes.CREATE, payload: { cacheId, element } }); // 创建缓存
      }
    },
    [cacheStates]
  );
  let handleScroll = useCallback(
    // 缓存滚动条
    (cacheId:string, { target }:any) => {
      if (cacheStates[cacheId]) {
        let scrolls = cacheStates[cacheId].scrolls;
        scrolls[target] = target.scrollTop;
      }
    },
    [cacheStates]
  );
  return (
    <CacheContext.Provider
      value={{ mount, cacheStates, dispatch, handleScroll }}
    >
      {props.children}
      {/* cacheStates维护所有缓存信息， dispatch派发修改缓存状态*/}
      {Object.values(cacheStates)
        .filter((cacheState) => cacheState.status !== cacheTypes.DESTROY)
        .map(({ cacheId, element }) => (
          <div
            id={`cache_${cacheId}`}
            key={cacheId}
            // 原生div中声明ref，当div渲染到页面，会执行ref中的回调函数，这里在id为cache_${cacheId}的div渲染完成后，会继续渲染子元素
            ref={(dom) => {
              let cacheState = cacheStates[cacheId];
              if (
                dom &&
                (!cacheState.doms || cacheState.status === cacheTypes.DESTROY)
              ) {
                let doms = Array.from(dom.childNodes);
                dispatch({
                  type: cacheTypes.CREATED,
                  payload: { cacheId, doms },
                });
              }
            }}
          >
            {element}
          </div>
        ))}
    </CacheContext.Provider>
  );
};

const useCacheContext = () => {
    const context = React.useContext(CacheContext);
    if (!context) {
      throw new Error("useCacheContext必须在Provider中使用");
    }
    return context;
  };
  export { KeepAlive, useCacheContext };
