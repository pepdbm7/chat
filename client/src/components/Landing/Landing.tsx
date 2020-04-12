import React, { SFC, useState, SyntheticEvent, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import "./styles.scss";

interface LandingProps {}

interface ILoginData {
  username: string;
  room: string;
}

const Landing: SFC<LandingProps> = (props) => {
  let history = useHistory();
  console.log(props);
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

  const onSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    console.log({ loginData }, { rememberMe });
    // validation:
    if (!loginData.username.trim() && !loginData.room.trim()) {
      setError("Username and room are missing");
    } else if (!loginData.username.trim()) {
      setError("A username is missing");
    } else if (!loginData.room.trim()) {
      setError("A room is missing");
    } else {
      remember();
      setLoginData({ username: "", room: "" });
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
        <input
          type="text"
          name="room"
          value={loginData.room}
          placeholder="Chatroom name"
          onChange={onChange}
        />
        <div className="checkbox">
          <label htmlFor="rememberme">Remember Me </label>
          <input
            name="rememberme"
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
