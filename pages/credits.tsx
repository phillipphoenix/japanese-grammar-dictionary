import { FC } from "react";
import Link from "next/link";
import Page from "../components/Page";
import styles from "../styles/Credits.module.css";
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import { MdArrowBack } from "react-icons/md";

const Credits: FC = () => {
  return (
    <Page title="Credits" tabTitle="日本語 Grammar Dictionary">
      <Center>
        <Box maxWidth={800}>
          <Box mb="1">
            <Link href="/">
              <Button leftIcon={<MdArrowBack />}>Back</Button>
            </Link>
          </Box>
          <Box mb="5" p={5} shadow="md" bg="white" rounded="md">
            <Heading size="md" mb="2">
              日本語 Grammar Dictionary
            </Heading>
            <Text>Created by Phillip Phoelich</Text>
            <Heading size="md" mt="3" mb="2">
              About the project
            </Heading>
            <Text>
              The project started late 2020. The first prototype of the site was finished during
              december 2020. During January and February of 2021, there was a change in UI,
              authentication was added with a user profile.
            </Text>
          </Box>
        </Box>
      </Center>
    </Page>
  );
};

export default Credits;
