import { Center, Container, Heading } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
//import styles from "./Page.module.css";

export interface PageProps {
  title: string;
  tabTitle?: string;
}

const pageWidths = [
  "100%", // 0-30em
  "90%", // 30em-48em
  "80%", // 48em-62em
  "70%", // 62em+
];

const Page: FC<PageProps> = ({ children, title, tabTitle }) => {
  return (
    <>
      <Head>
        <title>{tabTitle || title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container width={pageWidths} maxW={pageWidths} padding="0">
        <Container p="5">
          <Center>
            <Heading>{title}</Heading>
          </Center>
        </Container>
        <main>{children}</main>
        <footer>
          <p>Made with ☕ by Phillip</p>
          <p>
            <Link href="/credits">Go to credits page</Link>
          </p>
        </footer>
      </Container>
    </>
  );
};

export default Page;
