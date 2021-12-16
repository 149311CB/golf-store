import React from "react";
import Button from "../../../../components/button/Button";

const GoogleStrategy: React.FC<{ isRegister?: boolean }> = ({
  isRegister = false,
}) => {
  const login = async () => {
    window.open("https://localhost:5001/api/user/auth/login/google");
  };
  return (
    <Button onClick={login}>
      {!isRegister ? "Login" : "Register"} with Google
    </Button>
  );
};

export default GoogleStrategy;
