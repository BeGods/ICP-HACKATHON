import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/main.scss";
import "./styles/animations.scss";
import "./styles/arrow.scss";
import "./styles/moon.scss";
import "./index.css";
import "./styles/toast.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./utils/i18next.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-center"
      toastClassName="custom-toast"
      closeButton={false}
      limit={1}
    />
  </React.StrictMode>
);
