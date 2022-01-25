import React from "react";
import Button from "../../../../components/button/Button";
import { ReactComponent as FacebookIcon } from "../../../../assets/facebook-rounded-logo.svg";
import pkg from "../../../../../package.json";

const FacebookStrategy: React.FC<{ isRegister?: boolean }> = ({
  isRegister = false,
}) => {
  const login = () => {
    if(pkg.proxy){
      window.open(`${pkg.proxy}/api/user/auth/login/facebook`);
    }
  };
  return (
    <Button
      className={"secondary"}
      onClick={login}
      style={{
        color: "hsl(214, 89%, 52%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.9rem",
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
        <FacebookIcon />
      </span>
      {!isRegister ? "Login" : "Register"} with Facebook
    </Button>
  );
};

export default FacebookStrategy;
