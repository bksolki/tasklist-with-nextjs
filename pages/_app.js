import React, { Fragment } from "react";
import "../styles/globals.css";
import { AppAuthProvider } from "../context/authContext";
import { ChakraProvider } from "@chakra-ui/react";
import { customTheme } from "../styles/theme";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <AppAuthProvider>
        <ChakraProvider theme={customTheme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AppAuthProvider>
    </Fragment>
  );
}
export default MyApp;
