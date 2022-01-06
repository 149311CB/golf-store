import React, { CSSProperties } from "react";

enum borderEnum {
  normal = "normal",
  round = "round",
}
type borderStyles = keyof typeof borderEnum;

const GroupControls: React.FC<{
  borderStyle?: borderStyles;
  style?: CSSProperties;
}> = ({ children, borderStyle, style }) => {
  return (
    <div className={`group-control ${borderStyle}`} style={style}>
      {children}
    </div>
  );
};

export default GroupControls;
