import { MutableRefObject, useEffect, useRef } from "react";

export const useOnClickOutside = () => {
  //@ts-ignore
  const expandRef: MutableRefObject<HTMLDivElement> = useRef();

  useEffect(() => {
    const handler = (e: any) => {
      if (!expandRef.current.contains(e.target)) {
        expandRef.current.classList.remove("expand");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  return expandRef;
};
