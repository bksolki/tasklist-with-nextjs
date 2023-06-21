import React, { Fragment } from "react";
import "../styles/globals.css";
import { AppAuth } from "../context/authContext";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <AppAuth>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </AppAuth>
    </Fragment>
  );
}
export default MyApp;
