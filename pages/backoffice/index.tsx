import { FC, useState } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Page from "../../components/Page";
import { Box, Button, Divider, Flex, Heading, Spacer, Text } from "@chakra-ui/react";

const Backoffice: FC = () => {
  /** Used for instance to indicate that the user is logging out or other async action. */
  const [isUserInputLocked, setIsUserInputLocked] = useState<boolean>(false);

  const onLogOut = () => {
    setIsUserInputLocked(true);

    fetch("api/auth/signout")
      .catch()
      .then(() => {
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
            <Heading>User info</Heading>
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sessionStr = req.cookies["session"];

  if (!sessionStr) {
    res.statusCode = 302;
    res.setHeader("Location", "/login");
    return { props: {} };
  }

  return {
    props: {},
  };
};

export default Backoffice;
