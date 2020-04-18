import React, { SFC, useState, useEffect, SyntheticEvent } from "react";
import { Link, useHistory } from "react-router-dom";
// import { LOGOUT } from "../../socketEvents";

import "./styles.scss";

interface IChatProps {
  socket?: SocketIOClient.Socket;
  user?: IChatUser;
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

const Chat: SFC<IChatProps> = ({ socket, user }) => {
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

  useEffect(() => console.log({ messages }), [messages]);

  useEffect(() => console.log({ chatUsers }), [chatUsers]);

  const setError = (message: string): void => {
    setTimeout(() => setErrorMessage(""), 2000);
    setErrorMessage(message);
  };

  const handleSendMessage = (e: SyntheticEvent) => {
    e.preventDefault();

    if (messageToSend)
      socket?.emit("sendMessage", messageToSend, (error: string) => {
        if (error) return setError(error);
      });
    setMessageToSend("");
  };

  const handleLogout = () => {
    //clear connection:
    socket?.emit("disconnect");
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
        </div>
        <div className="messagesBoard">
          <form onSubmit={handleSendMessage}>
            <h3>Messages:</h3>
            <ul>
              {messages ? (
                <>
                  {messages.map((message: IMessage) => {
                    console.log(message.emitter, user?.username);
                    if (message.emitter === "admin")
                      return (
                        <li className="adminMessages" key={message.id}>
                          <p>{message.text}</p>
                        </li>
                      );
                    else if (message.emitter === user?.username)
                      return (
                        <li className="myMessages" key={message.id}>
                          <p className="userMessage">{message.emitter}</p>
                          <p>{message.text}</p>
                        </li>
                      );
                    else
                      return (
                        <li className="othersMessages" key={message.id}>
                          <p className="userMessage">{message.emitter}</p>
                          <p>{message.text}</p>
                        </li>
                      );
                  })}
                </>
              ) : null}
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
