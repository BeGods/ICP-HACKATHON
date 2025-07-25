import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeToggle } from "./ThemeToggle";
import "./i18n.js";
import { Toaster } from "react-hot-toast";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

// export function ThemeToggle() {
//   // Use `useColorModeValue` to get the background color based on the color mode
//
//   const { colorMode, toggleColorMode } = useColorMode()
//   return (
//     <Box bg={bgColor} p={4} minHeight="100vh">
//      <Button onClick={toggleColorMode}>
//           Toggle {colorMode === "light" ? "Dark" : "Light"}
//         </Button>
//     </Box>
//   );
// }
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster />
    <ThemeToggle />
  </React.StrictMode>
);
