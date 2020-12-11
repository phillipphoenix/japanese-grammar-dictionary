import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
