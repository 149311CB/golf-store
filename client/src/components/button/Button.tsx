import React from "react";

interface IButton {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: Function;
}

const Button: React.FC<IButton> = ({
  children,
  className = "",
  style,
  onClick,
}) => {
  return (
    <button
      className={`btn ${className}`}
      style={style}
      onClick={() => onClick && onClick()}
    >
      {children}
    </button>
  );
};

export default Button;
