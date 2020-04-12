import React, { SFC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.scss";

interface IChatProps {
  users?: IChatUsers[];
}

interface IChatUsers {
  id: number;
  name: string;
}

interface IChatDetails {}

const Chat: SFC<IChatProps> = (props) => {
  const [chatUsers, setChatUsers] = useState<IChatUsers[]>([
    {
      id: 0,
      name: "",
    },
  ]);

  // useEffect(() => {
  //   props.chatUsers && setChatUsers(props.chatUsers);
  // }, [props.chatUsers]);

  return (
    <div className="container">
      <h2 className="title">Chat</h2>
      <div className="leftboard">
        <ul>
          {chatUsers &&
            chatUsers.map((user, id) => (
              <li key={id}>
                {<Link to={`/chat/${user.name}`}>{user.name}</Link>}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
