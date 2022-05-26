import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider, CodesProvider } from "../context";

export const ProviderWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CodesProvider>{children}</CodesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
