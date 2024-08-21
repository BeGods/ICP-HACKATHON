import { Box, Button, ChakraProvider, useColorMode, useColorModeValue } from "@chakra-ui/react";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";

export function ThemeToggle() {
  // Use `useColorModeValue` to get the background color based on the color mode
  const bgColor = useColorModeValue("red.500", "yellow.200");

  return (
    <ChakraProvider bgColor='#000'>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ChakraProvider>
  );
}
