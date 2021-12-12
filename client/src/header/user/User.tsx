import React, {
  FormEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GlobalContext } from "../../App";
import Modal from "../../components/modal/Modal";
import { client } from "../../utils/client";

const User = () => {
  const [isOpen, setIsOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const value = useContext(GlobalContext);

  const clearForm = () => {
    const form = document.getElementById("login-form");
    if (form instanceof HTMLFormElement) {
      form.reset();
    }
  };

  const login = async (e: FormEvent) => {
    e.preventDefault();

    const data = await client.post(
      "/api/user/auth/login",
      {
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
      },
      {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    // const { token } = data;
    // localStorage.setItem("token", token);
    // setIsOpen(false);
  };

  useEffect(() => {
    clearForm();
  }, [isOpen]);

  useEffect(() => {
    value.setIsOpen = setIsOpen;
  }, [setIsOpen, value]);

  return (
    <>
      <div
        className={"header-user pop"}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <i className="fas fa-user"></i>
      </div>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        <form id={"login-form"}>
          <label>
            Email
            <input placeholder={"email"} type={"email"} ref={emailRef} />
          </label>
          <label>
            Password
            <input
              placeholder={"password"}
              type={"password"}
              ref={passwordRef}
            />
          </label>
          <button type={"submit"} onClick={(e) => login(e)}>
            Login
          </button>
        </form>
      </Modal>
    </>
  );
};

export default User;
