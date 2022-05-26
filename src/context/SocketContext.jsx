import React, { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext();
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(io(process.env.REACT_APP_API_URL));

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);
export { useSocket, SocketProvider };
