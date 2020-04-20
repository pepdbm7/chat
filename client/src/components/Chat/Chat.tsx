import React, { SFC, useState, useEffect, useRef, SyntheticEvent } from "react";
import { useHistory } from "react-router-dom";
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
  active?: boolean;
}

export interface IMessage {
  id: string;
  time: string;
  text: string;
  emitter: string;
}

const Chat: SFC<IChatProps> = ({ socket, user, setSocket, setUser }) => {
  const [chatUsers, setChatUsers] = useState<IChatUser[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const history = useHistory();
  const chatRef = useRef<HTMLUListElement>(null);

  useEffect(() => console.log(darkMode), [darkMode]);

  useEffect(() => {
    socket?.on("message", (message: IMessage): void => {
      setMessages((messages: IMessage[]) => [...messages, message]);
    });

    socket?.on("roomData", ({ users, error }: IRoomData): void => {
      error && setError(error);
      users && setChatUsers(users);
    });
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const setError = (message: string): void => {
    setTimeout(() => setErrorMessage(""), 2000);
    setErrorMessage(message);
  };

  const handleSendMessage = (e: SyntheticEvent) => {
    e.preventDefault();

    if (messageToSend)
      socket?.emit(
        SEND_MESSAGE,
        { sender: user, messageToSend },
        (error: string) => {
          if (error) return setError(error);
        }
      );

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
    <div className={darkMode ? "page dark" : "page"}>
      <h2 className="title">
        Room: <span>{user?.room}</span>
      </h2>
      <button className="darkMode" onClick={(e) => setDarkMode(!darkMode)}>
        {darkMode ? "Light" : "Dark"}
      </button>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      <div className="containerChat">
        <div className="usersBoard">
          <h3>Users:</h3>
          <ul>
            {user ? (
              <li className="me">
                <div className="connected" />
                {user.username} - (me)
              </li>
            ) : null}
            {chatUsers
              ? chatUsers.map((u: IChatUser) =>
                  u.username !== user?.username ? (
                    <li key={u.id}>
                      <div
                        className={
                          u.active === true ? "connected" : "notConnected"
                        }
                      />
                      {u.username}
                    </li>
                  ) : null
                )
              : null}
          </ul>
        </div>

        <div className="messagesBoard">
          <form onSubmit={handleSendMessage}>
            <h3>Messages:</h3>
            <ul ref={chatRef} className="messagesList">
              <MessagesList messages={messages} user={user} />
            </ul>
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
