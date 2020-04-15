import React, { SFC, useState, SyntheticEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import { JOINCHAT } from "../../socketEvents";
import "./styles.scss";

interface LandingProps {
  socket?: SocketIOClient.Socket | null;
}

interface ILoginData {
  username: string;
  room: string;
}

const Landing: SFC<LandingProps> = (props) => {
  let history = useHistory();
  const [loginData, setLoginData] = useState<ILoginData>({
    username: localStorage.getItem("username") || "",
    room: localStorage.getItem("room") || "",
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
        localStorage.setItem("room", loginData.room);
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
    socket?.emit(JOINCHAT, loginData, (error: string) => {
      if (error) {
        setError(error);
        console.log({ error });
        return;
      } else {
        console.log("all good! joined");
        remember();
        setLoginData({ username: "", room: "" });
        history.push("/chat");
      }
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Chat App</h1>
      </header>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          value={loginData.username}
          placeholder="Write your username"
          onChange={onChange}
        />
        <input
          type="text"
          name="room"
          value={loginData.room}
          placeholder="Write a room name"
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
