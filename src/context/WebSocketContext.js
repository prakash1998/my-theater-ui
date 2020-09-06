import React, { useState, useCallback } from "react";

const initialContext = {
  webSocket: null,
  isConnected: false,
  connectToServer: (_) => _,
  sendMessage: (_) => _,
};

const WebSocketContext = React.createContext(initialContext);

export default WebSocketContext;

const WEB_SOCKET_URL =
  process.env.NODE_ENV === "production" || true
    ? process.env.REACT_APP_WEB_SOCKET_URL ||
      "wss://my-theater-1234.herokuapp.com/theater"
    : "ws://localhost:8080/theater";

export const WebSocketContextProvider = ({ children }) => {
  const [webSocket, setWebSocket] = useState(null);

  console.log({ envs: process.env, WEB_SOCKET_URL });

  const connectToServer = useCallback(
    (roomId = "", subscriptionFunction = (_) => _, video) => {
      if (webSocket == null) {
        const ws = new WebSocket(`${WEB_SOCKET_URL}?room=${roomId}`);
        ws.onopen = () => {
          // on connecting, do nothing but log it to the console
          console.log("connected");
          setWebSocket(ws);
        };

        ws.onmessage = (evt) => {
          const jsonStr = evt.data || "{}";
          subscriptionFunction(JSON.parse(jsonStr));
        };

        ws.onclose = () => {
          console.log("disconnected");
          setWebSocket(null);
        };
      }
    },
    [webSocket]
  );

  const sendMessage = useCallback(
    (messageJson) => {
      webSocket && webSocket.send(JSON.stringify(messageJson));
    },
    [webSocket]
  );

  return (
    <WebSocketContext.Provider
      value={{
        webSocket,
        isConnected: Boolean(webSocket),
        connectToServer,
        sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
