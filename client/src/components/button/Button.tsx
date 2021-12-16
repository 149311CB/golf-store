import React from "react";

interface IButton {
  children: React.ReactNode;
  className?: string;
  border?: "border" | "borderless";
  borderRadius?:
    | "none"
    | "all"
    | "top"
    | "bottom"
    | "right"
    | "left"
    | "top-left"
    | "bottom-left"
    | "top-right"
    | "bottom-right";
  boxShadow?: "none" | "x-small" | "small" | "medium";
  style?: React.CSSProperties;
  onClick?: Function;
  disabled?: boolean;
}

const Button: React.FC<IButton> = ({
  children,
  className = "",
  border = "borderless",
  borderRadius = "all",
  boxShadow = "small",
  style,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`btn 
      ${disabled ? "disabled" : ""} 
      border-radius-${borderRadius} 
      ${className} 
      box-shadow-${boxShadow} 
      ${border}`}
      style={style}
      onClick={(e) => {
        return !disabled && onClick ? onClick(e) : null;
      }}
    >
      {children}
    </button>
  );
};

export default Button;
