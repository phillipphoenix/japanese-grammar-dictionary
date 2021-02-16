import { useEffect } from "react";
import Head from "next/head";
import { analytics } from "../utils/firebase";
import "../styles/globals.css";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// #f5f5f5

// Version 1: Using objects
const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "gray.100",
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Init firebase analytics, if prod environment.
    if (process.env.NODE_ENV === "production") {
      analytics();
    }
  }, []);

  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="public/icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="日本語 Grammar Dictionary" />
        <meta name="apple-mobile-web-app-title" content="日本語 Grammar Dictionary" />
        <meta name="msapplication-starturl" content="/" />
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
