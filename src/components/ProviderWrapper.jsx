import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, CodesProvider, SocketProvider } from "../context";

export const ProviderWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <CodesProvider>{children}</CodesProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
