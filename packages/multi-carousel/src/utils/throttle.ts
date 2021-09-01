const throttle = (
  func: () => void,
  limit: number,
  setIsInThrottle?: (value?: boolean) => void
): (() => void) => {
  let inThrottle: boolean;
  return function() {
    const args = arguments;
    // @ts-ignore
    const context = this;
    if (!inThrottle) {
      // @ts-ignore
      func.apply(context, args);
      inThrottle = true;
      if (typeof setIsInThrottle === "function") {
        setIsInThrottle(true);
      }
      setTimeout(() => {
        inThrottle = false;
        if (typeof setIsInThrottle === "function") {
          setIsInThrottle(false);
        }
      }, limit);
    }
  };
};

export default throttle;
