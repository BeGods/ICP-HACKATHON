import { useRef } from "react";

export const useDisableWrapper = () => {
  const disableRef = useRef(false);

  const wrapWithDisable = async (fn) => {
    if (disableRef.current || !fn) return;
    disableRef.current = true;
    try {
      await fn();
    } finally {
      disableRef.current = false;
    }
  };

  return { wrapWithDisable, disableRef };
};
