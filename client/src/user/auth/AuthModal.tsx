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
      <GoogleStrategy />
      <FacebookStrategy />
    </Modal>
  );
};

export default AuthModal;
