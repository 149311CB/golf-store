import React, { useContext, useRef } from "react";
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
  const { setActive, removeActiveSibling } = context;
  const defaultOnClick = () => {
    setActive(optionRef.current);
    if (optionRef.current?.classList.contains("v-disabled")) {
      optionRef.current?.classList.remove("v-disabled");
    }
  };
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
