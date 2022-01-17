import React from "react";
import Modal from "../../components/modal/Modal";
import FacebookStrategy from "./login/facebook/FacebookStrategy";
import GoogleStrategy from "./login/google/GoogleStrategy";
import Login from "./login/Login";

const AuthModal: React.FC<{ isOpen: boolean; setIsOpen: Function }> = ({
  isOpen,
  setIsOpen,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      styles={{
        backgroundColor: "hsl(0, 0%, 26%)",
        padding: "1.2rem",
        borderRadius: "0.3rem",
        width: "30%",
      }}
    >
      <Login />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.9rem",
          paddingTop: "0.6rem",
          paddingBottom: "0.6rem",
        }}
      >
        <span style={{ width: "100%" }}>
          <hr style={{ borderBottom: "0.5px solid hsl(0, 0%, 40%)" }} />
        </span>
        <span style={{ fontFamily: "Open Sans", fontSize: "0.875rem" }}>
          Or
        </span>
        <span style={{ width: "100%" }}>
          <hr style={{ borderBottom: "0.5px solid hsl(0, 0%, 40%)" }} />
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <GoogleStrategy />
        <FacebookStrategy />
      </div>
    </Modal>
  );
};

export default AuthModal;
