import * as cacheTypes from "./cacheTypes";
interface infoType {
    type: string;
    payload: payloadType;
}
interface payloadType {
    cacheId: number;
    element?: any;
    doms?: any;
}
interface cacheStateType {
    [propName: string]: any;
}
const cacheReducer = (cacheStates:cacheStateType = {}, { type, payload }:infoType) => {
  switch (type) {
    case cacheTypes.CREATE:
        return {
            ...cacheStates,
            [payload.cacheId]: {
            scroll: {}, // 滚动条位置缓存
            cacheId: payload.cacheId, // 缓存id
            element: payload.element, // 缓存元素
            doms: undefined, // 缓存元素的真实dom
            status: cacheTypes.CREATE, // 缓存状态
            },
        };
    case cacheTypes.CREATED:
        return {
            ...cacheStates,
            [payload.cacheId]: {
            ...cacheStates[payload.cacheId],
            doms: payload.doms,
            status: cacheTypes.CREATED,
            },
        };
    case cacheTypes.ACTIVATE:
        return {
            ...cacheStates,
            [payload.cacheId]: {
            ...cacheStates[payload.cacheId],
            status: cacheTypes.ACTIVATE,
            },
        };
    case cacheTypes.DESTROY:
        return {
            ...cacheStates,
            [payload.cacheId]: {
            ...cacheStates[payload.cacheId],
            status: cacheTypes.DESTROY,
            },
        };
    default:
      return cacheStates;
  }
};

export default cacheReducer;    // 用于缓存的reducer
