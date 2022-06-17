import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserContextProvider from "./contexts/userContext";
import SchedulesContextProvider from "./pages/Admin/Schedules/SchedulesContext";

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <SchedulesContextProvider>
        <App />
      </SchedulesContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
