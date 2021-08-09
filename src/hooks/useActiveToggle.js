import { useLayoutEffect, useRef, useState } from "react";

export const useActiveToggle = (deps) => {
  const [rect, setRect] = useState();
  const parentRef = useRef();
  useLayoutEffect(() => {
    setRect(parentRef.current.firstElementChild.classList.add("active"));
  }, []);
  return [rect, parentRef];
};
