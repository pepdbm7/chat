import React, { SFC, useState, SyntheticEvent, ChangeEvent } from "react";

interface LandingProps {
  onSubmit: (data: string) => void;
}

const Landing: SFC<LandingProps> = (props) => {
  const [loginData, setLoginData] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData(e.target.value);
  };

  const onSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    props.onSubmit(loginData);
  };

  return (
    <div className="landing">
      <header>
        <h1>Chat App</h1>
      </header>
      <form className="landingForm" onSubmit={onSubmit}>
        <input
          required
          type="text"
          placeholder="Write your username"
          onChange={onChange}
        />
        {/* <input type="text" placeholder="Chatroom name" onChange={onChange}/> */}
        <button type="submit">Start</button>
      </form>
    </div>
  );
};

export default Landing;
