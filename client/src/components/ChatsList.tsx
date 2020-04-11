import React, { SFC, useState, useEffect } from "react";
// import { Link } from "react-router-dom";

interface IChatsListProps {
  chats?: IChatListItem[];
}

interface IChatListItem {
  id: number;
  name: string;
}

const ChatsList: SFC<IChatsListProps> = (props) => {
  const [chats, setChats] = useState<IChatListItem[]>([]);

  useEffect(() => {
    props.chats && setChats(props.chats);
  }, [props]);

  return (
    <>
      <h2>Chats List</h2>
      <ul>
        {chats &&
          chats.map((chat, id) => (
            <li key={id}>{/* <Link to={`/${id}`}>{chat.name}</Link> */}</li>
          ))}
      </ul>
    </>
  );
};

export default ChatsList;
