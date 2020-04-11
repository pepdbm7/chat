import React, { SFC, useState, useEffect } from "react";

interface IChatProps {
  chatDetails?: IChatDetails;
}

interface IChatDetails {
  id: number;
  name: string;
}

const Chat: SFC<IChatProps> = (props) => {
  const [chatDetails, setChatDetails] = useState<IChatDetails>({
    id: 0,
    name: "",
  });

  useEffect(() => {
    props.chatDetails && setChatDetails(props.chatDetails);
  }, [props.chatDetails]);

  return (
    <>
      <p>hello!!</p>
      {chatDetails}
    </>
  );
};

export default Chat;
