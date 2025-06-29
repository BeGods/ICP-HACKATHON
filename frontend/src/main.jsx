import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/main.scss";
import "./styles/animations.scss";
import "./styles/arrow.scss";
import "./styles/credits.scss";
import "./styles/moon.scss";
import "./styles/lottie.scss";
import "./styles/glowButton.scss";
import "./styles/dnd.scss";
import "./styles/scratch.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./utils/i18next.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    <ToastContainer
      position="top-center"
      toastClassName="custom-toast"
      closeButton={false}
      limit={1}
    />
  </>
);
