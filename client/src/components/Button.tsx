import React from "react";

interface IButton {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Button: React.FC<IButton> = ({ children, style }) => {
  return (
    <button className={"btn"} style={style}>
      {children}
    </button>
  );
};

export default Button;
