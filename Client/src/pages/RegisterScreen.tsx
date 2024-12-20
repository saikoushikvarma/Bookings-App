import axios, { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import ToastModal from "../components/ToastModal";

const RegisterScreen = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    title: "",
    isError: false,
  });

  const onRegister = (event: FormEvent) => {
    event.preventDefault();
    axios
      .post("/register", {
        userName,
        email,
        password,
      })
      .then((res) => {
        if (!isEmpty(res.data)) {
          setUserName("");
          setEmail("");
          setPassword("");
          setToast((prev) => ({
            ...prev,
            show: true,
            title: "Your registartion is successfull",
            isError: false,
          }));
        }
      })
      .catch((err: AxiosError) => {
        setToast((prev) => ({
          ...prev,
          show: true,
          title: err?.response?.data?.message,
          isError: true,
        }));
      });
  };

  return (
    <div className="flex items-center grow justify-center relative">
      {toast?.show && (
        <ToastModal
          title={toast.title}
          handleShow={() => {
            setToast((prev) => ({
              ...prev,
              show: false,
            }));
          }}
          isError={toast.isError}
        />
      )}
      <div className="">
        <h1 className="text-4xl text-center">Register</h1>
        <form onSubmit={onRegister} className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Koushik Varma"
            value={userName}
            onChange={(el) => setUserName(el.target.value)}
            required
          />
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(el) => setEmail(el.target.value)}
            required
          />
          <div className="flex">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <div
              className="flex justify-around items-center"
              onClick={() => setShow(!show)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mr-10 absolute"
              >
                {!show ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>
          <button type="submit" className="primaryBtn">
            Login
          </button>
          <div className="text-center text-gray-400">
            Already a Member?{" "}
            <Link className="text-blue-600 underline" to={"/login"}>
              Login Here!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterScreen;
