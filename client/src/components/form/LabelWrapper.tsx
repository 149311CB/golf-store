import React, { CSSProperties } from "react";

const LabelWrapper: React.FC<{
  name: string;
  required?: boolean;
  styles?: CSSProperties;
}> = ({ name, children, styles, required = false }) => {
  return (
    <div style={styles}>
      <p style={{ paddingBottom: "0.3rem" }}>
        {name}
        {required && <span> *</span>}
      </p>
      <div style={{ display: "flex", gap: "0.6rem" }}>{children}</div>
    </div>
  );
};

export default LabelWrapper;
