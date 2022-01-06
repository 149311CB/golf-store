import React, { CSSProperties } from "react";

const Select: React.FC<{
  disabled?: boolean;
  style?: CSSProperties;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ disabled = false, style, onChange, children }) => {
  return (
    <div
      className={"select"}
      style={{ ...style, display: "flex", overflow: "hidden" }}
    >
      <select
        className={`${disabled && "disabled"}`}
        disabled={disabled}
        style={{ width: "100%" }}
        onChange={(e) => {
          onChange(e);
        }}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
