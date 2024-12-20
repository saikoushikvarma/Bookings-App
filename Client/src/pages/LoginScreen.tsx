import axios, { AxiosError } from "axios";
import { FormEvent, useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userContext } from "../contextAPI/userContext";
import isEmpty from "lodash/isEmpty";
import { actionsTypes } from "../contextAPI/userContext/types";
import { localTokenKey } from "../assets/contants";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const { dispatch } = useContext(userContext);
  const { state: routeState } = useLocation();
  const navigate = useNavigate();

  const loginSubmit = (opt: FormEvent) => {
    opt.preventDefault();
    axios
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        const { accessToken, username, image_id } = res.data;
        if (!isEmpty(username) && !isEmpty(accessToken)) {
          dispatch({ type: actionsTypes.USER_NAME, payload: username });
          dispatch({ type: actionsTypes.USER_LOGIN_STATUS, payload: true });
          dispatch({ type: actionsTypes.PROFILE_IMAGE, payload: image_id });
          localStorage.setItem(localTokenKey, accessToken);
          debugger;
          if (routeState?.id >= 0) {
            navigate(`/place/${routeState.id}`, { replace: true });
          } else {
            navigate("/");
          }
        }
      })
      .catch((err: AxiosError<{ message: string }>) =>
        alert(err.response?.data?.message)
      );
  };

  return (
    <div className="flex items-center grow justify-center">
      <div className="">
        <h1 className="text-4xl text-center">Login</h1>
        <form onSubmit={loginSubmit} className="max-w-md mx-auto">
          <input
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            type="email"
            placeholder="example@gmail.com"
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
          <div className="text-center text-gray-300">
            Don't have an account?{" "}
            <Link className="text-blue-600 underline" to={"/register"}>
              Register Here!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
