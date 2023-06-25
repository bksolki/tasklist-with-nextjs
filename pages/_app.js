import React, { Fragment } from "react";
import "../styles/globals.css";
import { AppAuthProvider } from "../context/authContext";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <AppAuthProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AppAuthProvider>
    </Fragment>
  );
}
export default MyApp;
