import React from "react";

enum alert {
  error = "error",
  success = "success",
  warning = "warning",
}
type alertType = keyof typeof alert;

const Alert: React.FC<{
  type: alertType;
  closeHandler?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
}> = ({ type, closeHandler, children }) => {
  return (
    <div className={`alert ${type && type}`}>
      {children}
      <span
        className={"close-btn"}
        onClick={(e) => {
          closeHandler && closeHandler(e);
        }}
      >
        <i className="fas fa-times-circle"></i>
      </span>
    </div>
  );
};

export default Alert;
