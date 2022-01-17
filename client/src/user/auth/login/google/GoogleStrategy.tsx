import React from "react";
import Button from "../../../../components/button/Button";
import { ReactComponent as GoogleIcon } from "../.././../../assets/google.svg";

const GoogleStrategy: React.FC<{ isRegister?: boolean }> = ({
  isRegister = false,
}) => {
  const login = async () => {
    window.open("https://localhost:5001/api/user/auth/login/google");
  };
  return (
    <Button
      className={"secondary"}
      onClick={login}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap:"0.6rem"
      }}
    >
      <span
        className={"login-facebook-icon"}
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: "0.1rem",
        }}
      >
        <GoogleIcon />
      </span>
      {!isRegister ? "Login" : "Register"} with Google
    </Button>
  );
};

export default GoogleStrategy;
