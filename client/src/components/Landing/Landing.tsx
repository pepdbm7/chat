import React, { SFC, useState, SyntheticEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import { VERIFY_USER } from "../../actions";
import "./styles.scss";

interface LandingProps {
  socket?: SocketIOClient.Socket | null;
}

interface ILoginData {
  username: string;
}

const Landing: SFC<LandingProps> = (props) => {
  let history = useHistory();
  console.log(props);
  const [loginData, setLoginData] = useState<ILoginData>({
    username: localStorage.getItem("username") || "",
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const remember = (): void => {
    if (typeof Storage !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("username", loginData.username);
      } else {
        localStorage.clear();
      }
    }
  };

  const setError = (message: string): void => {
    setTimeout(() => setErrorMessage(""), 2000);
    setErrorMessage(message);
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const { socket } = props;
    socket?.emit(VERIFY_USER, loginData.username);

    // validation:
    if (!loginData.username.trim()) {
      setError("A username is missing");
    } else {
      remember();
      setLoginData({ username: "" });
      history.push("/chatslist");
    }
  };

  return (
    <div className="landing">
      <header>
        <h1>Chat App</h1>
      </header>
      <form className="landingForm" onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          value={loginData.username}
          placeholder="Write your username"
          onChange={onChange}
        />
        <div className="checkbox">
          <label htmlFor="rememberme">Remember Me </label>
          <input
            id="rememberme"
            type="checkbox"
            value={rememberMe.toString()}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </div>

        <button type="submit">Start</button>
      </form>
      <p className="errorMessage">{errorMessage}</p>
    </div>
  );
};

export default Landing;
