import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeToggle } from './ThemeToggle';
import "./i18n.js"
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
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeToggle/>
  </React.StrictMode>,
);
