import { FC, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Page from "../../components/Page";
import { Box, Button, Divider, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import firebase from "firebase";
import { useAuth } from "../../Providers/AuthProvider";

const Backoffice: FC = () => {
  const { push } = useRouter();
  const { user } = useAuth();
  /** Used for instance to indicate that the user is logging out or other async action. */
  const [isUserInputLocked, setIsUserInputLocked] = useState<boolean>(false);

  const onLogOut = () => {
    setIsUserInputLocked(true);

    firebase
      .auth()
      .signOut()
      .then(() => {
        push("/");
      })
      .catch(() => {
        setIsUserInputLocked(false);
      });
  };

  return (
    <Page title="Backoffice" tabTitle="Backoffice - 日本語 Grammar Dictionary">
      <Flex>
        <Box width="65%" p="5">
          <Heading>Entries</Heading>
        </Box>
        <Box width="35%" p="5" shadow="md" bg="white" rounded="md">
          <Flex>
            <Heading>{user ? user.displayName || user.email : null}</Heading>
            <Spacer />
            <Button onClick={onLogOut}>Sign out</Button>
          </Flex>
          <Divider mt="2" mb="2" />
          <Text>TODO: Create a way to update user details here.</Text>
        </Box>
      </Flex>
    </Page>
  );
};

// --- SERVER SIDE ---

import nookies from "nookies";
import { firebaseAdmin } from "../../utils/api/firebaseAdmin";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const cookies = nookies.get(ctx);
    console.log(JSON.stringify(cookies, null, 2));
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    const { uid, email } = token;

    // the user is authenticated!
    // FETCH STUFF HERE

    return {
      props: {},
    };
  } catch (err) {
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      // `as never` is required for correct type inference
      // by InferGetServerSidePropsType below
      props: {} as never,
    };
  }
};

export default Backoffice;
