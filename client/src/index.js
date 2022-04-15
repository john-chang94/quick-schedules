import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserContextProvider from "./contexts/userContext";

ReactDOM.render(
  <UserContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    ,
  </UserContextProvider>,
  document.getElementById("root")
);
