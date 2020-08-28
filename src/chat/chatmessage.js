import React from "react";

const ChatMessage = ({ name, message }) => (
  <p>
    <strong>{name}</strong> <em>{message}</em>
  </p>
);

export default ChatMessage;
