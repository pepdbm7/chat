import React, { SFC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MESSAGE_SENT } from "../../socketEvents";

import "./styles.scss";

interface IChatProps {
  socket?: SocketIOClient.Socket;
  user?: IChatUser[];
}

interface IRoomData {
  users?: IChatUser[];
  error?: string;
}

interface IChatUser {
  id: string;
  username?: string;
  room?: string;
}

interface IMessage {
  id: string;
  time: string;
  text: string;
  emitter: string;
}

interface IChatDetails {}

const Chat: SFC<IChatProps> = ({ socket, user }) => {
  const [chatUsers, setChatUsers] = useState<IChatUser[]>([
    // {
    //   id: "",
    //   username: "",
    //   room: "",
    // },
  ]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    socket?.on("message", (message: IMessage): void => {
      setMessages((messages: IMessage[]) => [...messages, message]);
    });

    socket?.on("roomData", ({ users, error }: IRoomData): void => {
      error && setError(error);
      users && setChatUsers(users);
    });
  }, []);

  const setError = (message: string): void => {
    setTimeout(() => setErrorMessage(""), 2000);
    setErrorMessage(message);
  };

  return (
    <div className="container">
      <h2 className="title">Chat</h2>
      <div className="leftboard">
        <ul>
          {chatUsers
            ? chatUsers.map((user: IChatUser) => (
                <li key={user.id}>
                  {
                    <Link
                      to={""}
                      // to={`/chat/${user.name}`}
                    >
                      {user.username}
                    </Link>
                  }
                </li>
              ))
            : null}
        </ul>

        {messages ? (
          <ul>
            Messages{" "}
            {messages.map((message: IMessage) => (
              <li key={message.id}>{message.text}</li>
            ))}
          </ul>
        ) : null}

        <p className="errorMessage">{errorMessage}</p>

        <Link to={"/"}>Logout</Link>
      </div>
    </div>
  );
};

export default Chat;
