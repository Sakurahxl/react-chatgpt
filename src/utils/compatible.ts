interface TransitionEnd {
  [key: string]: string;
}

function getTransitionEndName(dom: HTMLElement): string | undefined {
  const cssTransition = ["transition", "webkitTransition"];
  const transitionEnd: TransitionEnd = {
    transition: "transitionend",
    webkitTransition: "webkitTransitionEnd"
  };
  for (const key of cssTransition) {
    if (dom.style[key as keyof CSSStyleDeclaration] !== undefined) {
      return transitionEnd[key];
    }
  }
  return undefined;
}

export { getTransitionEndName };
