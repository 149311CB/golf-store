import { MutableRefObject, useEffect, useRef } from "react";

export const useOnClickOutside = () => {
  //@ts-ignore
  const expandRef: MutableRefObject<HTMLDivElement> = useRef();

  useEffect(() => {
    expandRef.current.style.display = "none"
    const handler = (e: any) => {
      if (!expandRef.current.contains(e.target)) {
        expandRef.current.style.display = 'none'
        // .classList.remove("expand");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return expandRef;
};
