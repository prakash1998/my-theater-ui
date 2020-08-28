import React, { useState, useContext } from "react";
import ChatInput from "./chatinput";
import ChatMessage from "./chatmessage";
import { WebSocketContext } from "../context";

const Chat = () => {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);

  const { webSocket: ws, connectToServer } = useContext(WebSocketContext);

  const addMessage = (message) =>
    setMessages((messages) => [message, ...messages]);

  const submitMessage = (messageString) => {
    const message = { type: name, message: messageString };
    ws.send(JSON.stringify(message));
    // addMessage(message);
  };

  return (
    <div>
      <label htmlFor="room">
        Room:&nbsp;
        <input
          type="text"
          id={"room"}
          placeholder={"Enter room to join room..."}
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
      </label>
      <button
        onClick={() =>
          connectToServer(room, "", (msg) => {
            addMessage(msg);
          })
        }
      >
        {" "}
        Join{" "}
      </button>
      <br />
      <label htmlFor="name">
        Name:&nbsp;
        <input
          type="text"
          id={"name"}
          placeholder={"Enter your name..."}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <br />
      Message:
      <ChatInput
        ws={ws}
        onSubmitMessage={(messageString) => submitMessage(messageString)}
      />
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          message={message.message}
          name={message.type}
        />
      ))}
    </div>
  );
};

export default Chat;
