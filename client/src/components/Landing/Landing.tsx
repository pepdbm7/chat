import React, { SFC, useState, SyntheticEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import { JOIN_CHAT } from "../../socketEvents";
import "./styles.scss";

interface LandingProps {
  socket?: SocketIOClient.Socket | null;
  setUser: Function;
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

    const join = socket?.emit(JOIN_CHAT, loginData, (error: string) => {
      if (error) return setError(error);
      debugger;
    });

    console.log(join);

    // if (join && !errorMessage) {
    //   console.log("all good! joined");
    //   remember();
    //   props.setUser({ username: loginData.username, room: loginData.room });
    //   setLoginData({ username: "", room: "" });
    //   history.push("/chat");
    // }
  };

  return (
    <div className="container">
      <header>
        <h1>Chat App</h1>
      </header>
      <form onSubmit={onSubmit}>
        <input
          className="input"
          type="text"
          name="username"
          value={loginData.username}
          placeholder="Write your username"
          onChange={onChange}
        />
        <input
          className="input"
          type="text"
          name="room"
          value={loginData.room}
          placeholder="Write a room name"
          onChange={onChange}
        />
        <label className="checkbox" htmlFor="rememberme">
          Remember Me
          <input
            id="rememberme"
            type="checkbox"
            value={rememberMe.toString()}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="checkmark"></span>
        </label>

        <input className="input" type="submit" value="Log In" />
      </form>
      <p className="errorMessage">{errorMessage}</p>
    </div>
  );
};

export default Landing;
