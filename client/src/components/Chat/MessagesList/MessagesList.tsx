import React, { SFC, useEffect, useRef } from "react";
import { IMessage, IChatUser } from "../Chat";

import "./styles.scss";

interface IMessagesProps {
  messages?: IMessage[];
  user?: IChatUser;
}

const MessagesList: SFC<IMessagesProps> = ({ messages, user }) => (
  <>
    {messages ? (
      <>
        {messages.map((message: IMessage) => {
          if (message.emitter === "admin")
            return (
              <li className="adminMessages" key={message.id}>
                <p>{message.text}</p>
              </li>
            );
          else if (message.emitter === user?.username)
            return (
              <li className="myMessages" key={message.id}>
                <p className="userMessage">
                  {message.emitter} - <span>{message.time}</span>
                </p>
                <p className="messageText">{message.text}</p>
              </li>
            );
          else
            return (
              <li className="othersMessages" key={message.id}>
                <p className="userMessage">
                  {message.emitter} - <span>{message.time}</span>
                </p>
                <p className="messageText">{message.text}</p>
              </li>
            );
        })}
      </>
    ) : null}
  </>
);

export default MessagesList;
