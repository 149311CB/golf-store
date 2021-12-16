import React from "react";
import Button from "../../../../components/button/Button";

const FacebookStrategy: React.FC<{ isRegister?: boolean }> = ({
  isRegister = false,
}) => {
  const login = () => {
    window.open("https://localhost:5001/api/user/auth/login/facebook");
  };
  return (
    <Button onClick={login}>
      {!isRegister ? "Login" : "Register"} with Facebook
    </Button>
  );
};

export default FacebookStrategy;
