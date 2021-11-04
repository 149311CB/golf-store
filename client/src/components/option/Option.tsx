import React, { useContext, useEffect, useRef, useState } from "react";
import { OptionGroupContext } from "./OptionGroup";

interface OptionProps {
  children?: React.ReactNode;
  onClick?: Function;
  visualDisabled?: boolean;
  style?: React.CSSProperties;
  value?: any;
}

const Option: React.FC<OptionProps> = ({
  children,
  onClick,
  visualDisabled,
  style,
  value,
}) => {
  const context = useContext(OptionGroupContext);
  const optionRef = useRef<HTMLDivElement>(null);
  const { setActive, removeActiveSibling, runCallback } = context;

  // Remove v-disabled on option click
  // Set active to the current clicked ref
  const defaultOnClick = () => {
    setActive(optionRef.current);
    runCallback(value);

    if (optionRef.current?.classList.contains("v-disabled")) {
      optionRef.current?.classList.remove("v-disabled");
    }
  };

  useEffect(() => {
    if (optionRef.current?.classList.contains("active")) {
      runCallback(value);
    }
  });

  return (
    <div
      className={`option ${visualDisabled ? "v-disabled" : ""}`}
      onClick={(e) => {
        removeActiveSibling(e);
        defaultOnClick();
        onClick && onClick(value);
      }}
      ref={optionRef}
      style={style}
    >
      {children}
    </div>
  );
};

export default Option;
