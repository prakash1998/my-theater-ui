import React from "react";
import { WebSocketContextProvider } from "./WebSocketContext";

const ContextHierarchy = ({ children }) => {
  return <WebSocketContextProvider>{children}</WebSocketContextProvider>;
};

export default ContextHierarchy;
