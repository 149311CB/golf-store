import React, { CSSProperties } from "react";

const LabelWrapper: React.FC<{ name: string; styles?: CSSProperties }> = ({
  name,
  children,
  styles,
}) => {
  return (
    <div style={styles}>
      <p style={{ paddingBottom: "0.3rem" }}>{name}</p>
      <div style={{ display: "flex", gap: "0.6rem" }}>{children}</div>
    </div>
  );
};

export default LabelWrapper;
