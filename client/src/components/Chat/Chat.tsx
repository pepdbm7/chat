import React, { SFC, useState, useEffect, SyntheticEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import MessagesList from "./MessagesList/MessagesList";
import { SEND_MESSAGE, LOGOUT } from "../../socketEvents";

import "./styles.scss";

interface IChatProps {
  socket?: SocketIOClient.Socket;
  user?: IChatUser;
  setUser: Function;
  setSocket: Function;
}

interface IRoomData {
  users?: IChatUser[];
  error?: string;
}

export interface IChatUser {
  id: string;
  username?: string;
  room?: string;
}

export interface IMessage {
  id: string;
  time: string;
  text: string;
  emitter: string;
}

const Chat: SFC<IChatProps> = ({ socket, user, setSocket, setUser }) => {
  const [chatUsers, setChatUsers] = useState<IChatUser[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    socket?.on("message", (message: IMessage): void => {
      setMessages((messages: IMessage[]) => [...messages, message]);
    });

    socket?.on("roomData", ({ users, error }: IRoomData): void => {
      error && setError(error);
      users && setChatUsers(users);
    });
  }, []);

  // useEffect(() => console.log({ chatUsers }), [chatUsers]);

  const setError = (message: string): void => {
    setTimeout(() => setErrorMessage(""), 2000);
    setErrorMessage(message);
  };

  const handleSendMessage = (e: SyntheticEvent) => {
    e.preventDefault();

    if (messageToSend)
      socket?.emit(SEND_MESSAGE, messageToSend, (error: string) => {
        if (error) return setError(error);
      });
    setMessageToSend("");
  };

  const handleLogout = () => {
    //clear connection:
    socket?.emit(LOGOUT);
    setSocket(null);
    setUser(null);
    //clear data from local state:
    setChatUsers([]);
    setMessages([]);
    setErrorMessage("");
    //go to landing:
    history.push("/");
  };

  return (
    <div className="page">
      <h2 className="title">
        Room: <span>{user?.room}</span>
      </h2>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      <div className="containerChat">
        <div className="usersBoard">
          <h3>Users:</h3>
          <ul>
            {chatUsers
              ? chatUsers.map((user: IChatUser) => (
                  <li key={user.id}>
                    {
                      //<Link
                      //   to={""}
                      // to={`/chat/${user.name}`}
                      // >
                      // {
                      user.username
                      // }
                      // </Link>
                    }
                  </li>
                ))
              : null}
          </ul>
        </div>
        <div className="messagesBoard">
          <form onSubmit={handleSendMessage}>
            <h3>Messages:</h3>
            <MessagesList messages={messages} user={user} />
            <input
              className="input"
              type="text"
              name="room"
              value={messageToSend}
              placeholder="Write something..."
              onChange={(e) => setMessageToSend(e.target.value)}
            />
            <input className="input" type="submit" value="Send" />
            <p className="errorMessage">{errorMessage}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
