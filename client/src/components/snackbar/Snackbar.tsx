import React, { useCallback, useEffect, useState } from "react";

enum borderRadius {
  none = "none",
  all = "all",
  top = "top",
  bottom = "bottom",
  right = "right",
  left = "left",
  topLeft = "top-left",
  bottomLeft = "bottom-left",
  topRight = "top-right",
  bottomRight = "bottom-right",
}
type borderRadiusType = keyof typeof borderRadius;

enum boxShadow {
  "none",
  "x-small",
  "small",
  "medium",
}
type boxShadowType = keyof typeof boxShadow;

const jellyPopup = [
  { boxShadow: "none" },
  {
    boxShadow: `3px 3px 6px hsla(0, 0%, 12%, 100%),
          -3px -3px 6px hsla(0, 0%, 28%, 100%)`,
    transform: `scale(1.05)`,
  },
  {
    boxShadow: `4px 4px 12px hsl(0, 0%, 12%), 
          -4px -4px 10px hsl(0, 0%, 28%)`,
    transform: `scale(1.1)`,
  },
  {
    boxShadow: `3px 3px 6px hsla(0, 0%, 12%, 100%),
          -3px -3px 6px hsla(0, 0%, 28%, 100%)`,
    transform: `scale(1.05)`,
  },
];
const fade = [
  {
    opacity: 0,
    transform: `translate(50%,-50%)`,
  },
  {
    opacity: 0.25,
    transform: `translate(50%,-50%)`,
  },
  {
    opacity: 0.5,
    transform: `translate(50%,-50%)`,
  },
  {
    opacity: 0.75,
    transform: `translate(50%,-50%)`,
  },
  {
    opacity: 1,
    transform: `translate(50%,-50%)`,
  },
];

// TODO: Add hover to stop timeout behavior and be able to close snackbar
const Snackbar: React.FC<{
  open: boolean;
  closeHandler: (open: boolean) => void;
  borderRadius?: borderRadiusType;
  boxShadow?: boxShadowType;
  timeout?: number;
}> = ({ open, closeHandler, borderRadius, boxShadow, timeout, children }) => {
  const [delay, setDelay] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number>(-1);
  const timeoutCallback = useCallback(
    (toast: Element) => {
      closeHandler(false);
      toast.animate(jellyPopup.slice().reverse(), {
        duration: 250,
        easing: "cubic-bezier(0.11, 0.42, 0.89, 0.45)",
        fill: "forwards",
      });
      toast.animate(fade.slice().reverse(), {
        duration: 250,
        easing: "ease-in",
        fill: "forwards",
      });
    },
    [closeHandler]
  );

  useEffect(() => {
    if (delay) {
      window.clearTimeout(timeoutId);
    }
  }, [delay, timeoutId, timeoutCallback, open]);

  // This is to close snackbar and animate snackbar out
  useEffect(() => {
    if (!open) {
      return;
    }
    const toast = document.querySelector(".snackbar");
    if (open && toast) {
      const id = window.setTimeout(() => timeoutCallback(toast), timeout);
      setTimeoutId(id);
    }
  }, [open, timeout, delay, timeoutCallback]);

  // This is for animate snackbar in
  useEffect(() => {
    const toast = document.querySelector(".snackbar");

    if (open && toast) {
      toast.animate(jellyPopup, {
        duration: 250,
        easing: "cubic-bezier(0.11, 0.42, 0.89, 0.45)",
        fill: "forwards",
      });
      toast.animate(fade, {
        duration: 250,
        easing: "ease-in",
        fill: "forwards",
      });
    }
  }, [open]);

  return (
    <div
      className={`snackbar border-radius-${borderRadius} box-shadow-${boxShadow}`}
      onMouseEnter={() => {
        setDelay(true);
      }}
      onMouseLeave={() => {
        delay && setDelay(false);
      }}
    >
      {children}
    </div>
  );
};

export default Snackbar;
