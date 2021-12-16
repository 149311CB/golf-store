import React, { CSSProperties } from "react";
import ReactDOM from "react-dom";

const OVERLAY_STYLES: CSSProperties = {
  position: "fixed",
  top: "0",
  left: "0",
  bottom: "0",
  right: "0",
  background: "hsla(0,0%,0%,0.7)",
};

const MODAL_STYLES: CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#FFF",
  zIndex: 1000,
};

const Modal: React.FC<{
  isOpen: boolean;
  setIsOpen: Function;
  styles?: CSSProperties;
}> = ({ children, isOpen = false, setIsOpen, styles }) => {
  if (!isOpen) return null;
  const element = document.getElementById("portal");

  if (element) {
    return ReactDOM.createPortal(
      <>
        <div
          className={"modal-overlay"}
          style={OVERLAY_STYLES}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div className={"modal"} style={{ ...MODAL_STYLES, ...styles }}>
          {children}
        </div>
      </>,
      element
    );
  }
  return <div></div>;
};

export default Modal;
