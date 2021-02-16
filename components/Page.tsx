import { Box, Button, Center, Container, Heading, Spacer, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
//import styles from "./Page.module.css";

export interface PageProps {
  title: string;
  tabTitle?: string;
}

const pageWidths = [
  "96%", // 0-30em
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
      <Container width={pageWidths} maxW={pageWidths} minH="100%" padding="0">
        <Box p="5">
          <Center>
            <Heading
              bgGradient="linear(to-br, pink.800, orange.400)"
              bgClip="text"
              fontWeight="extrabold"
            >
              {title}
            </Heading>
          </Center>
        </Box>
        <Box as="main">{children}</Box>
        <Box as="footer" p="4">
          <Box>
            <Center>
              <Text textAlign="center">Made with ☕ by Phillip</Text>
            </Center>
            <Center>
              <Link href="/credits">
                <Button mt="2">Go to credits</Button>
              </Link>
            </Center>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Page;
