import { FormEvent, useRef } from "react";
import { client } from "../../../../utils/client";
import LabelWrapper from "../../../../components/form/LabelWrapper";
import Button from "../../../../components/button/Button";

const EmailStrategy = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const login = async (e: FormEvent) => {
    e.preventDefault();

    const { status } = await client.post(
      "/api/user/auth/login",
      {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      },
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (status === 200) {
      window.location.href = "/";
    }
  };

  return (
    <form id={"login-form"}>
      <LabelWrapper name={"Email"}>
        <input placeholder={"email"} type={"email"} ref={emailRef} />
      </LabelWrapper>
      <LabelWrapper name={"Password"}>
        <input placeholder={"password"} type={"password"} ref={passwordRef} />
      </LabelWrapper>
      <Button onClick={(e: any) => login(e)} className={"secondary"}>
        Login
      </Button>
    </form>
  );
};
export default EmailStrategy;
