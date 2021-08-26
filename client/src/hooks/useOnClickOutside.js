const { useEffect, useRef } = require("react");

export const useOnClickOutside = () => {
  const expandRef = useRef();

  useEffect(() => {
    const handler = (e) => {
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
