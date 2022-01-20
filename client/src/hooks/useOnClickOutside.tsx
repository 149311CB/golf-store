import { MutableRefObject, useEffect, useRef } from "react";

export const useOnClickOutside = () => {
  //@ts-ignore
  const expandRef: MutableRefObject<HTMLDivElement> = useRef();

  useEffect(() => {
    console.log("i'm run")
    const handler = (e: any) => {
      if (!expandRef.current.contains(e.target)) {
        expandRef.current.style.display = 'none'
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  // Hide ref element on the first render
  useEffect(() => {
    expandRef.current.style.display = "none"
  }, [])

  return expandRef;
};
