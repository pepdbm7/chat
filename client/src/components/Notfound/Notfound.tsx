import React from "react";
import { useHistory } from "react-router-dom";
import "./styles.scss";

interface NotfoundProps {}

const Notfound: React.SFC<NotfoundProps> = () => {
  const history = useHistory();
  console.log({ history });
  return (
    <div className="container">
      <h2>Oups! Not found page!!</h2>
      <button className="goBack" onClick={() => history.push("/")}>
        Go back
      </button>
    </div>
  );
};

export default Notfound;
