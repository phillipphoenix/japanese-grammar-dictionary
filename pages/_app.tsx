import Head from "next/head";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" href="public/icons/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
