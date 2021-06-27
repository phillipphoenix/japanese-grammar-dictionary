import { FC, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { MdArrowBack, MdModeEdit } from "react-icons/md";

import { useFurigana } from "../hooks/useFurigana";
import Page from "../components/Page";
import DefaultMenu from "../components/DefaultMenu/DefaultMenu";
import Descriptor from "../components/Descriptor/Descriptor";
import { EntryData } from "../types/components/entryData";

const Dashboard: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  entriesWithoutExamples,
}) => {
  const [noExampleEntries, setNoExampleEntries] = useState<EntryData[]>([]);
  const [noExamplesPage, setNoExamplesPage] = useState<number>(0);
  const [totalNoExamplesPages, setTotalNoExamplesPages] = useState<number>(0);
  const [convertFurigana] = useFurigana();

  const buttonSize = useBreakpointValue({ base: "xs", sm: "sm" });

  const PAGE_SIZE = 6;

  useEffect(() => {
    const currentStartingEntry = noExamplesPage * PAGE_SIZE;
    const currentEndingEntry = currentStartingEntry + PAGE_SIZE;

    const pageEntries = entriesWithoutExamples.slice(currentStartingEntry, currentEndingEntry);

    setNoExampleEntries(pageEntries);
  }, [noExamplesPage]);

  useEffect(() => {
    const pages = Math.ceil((entriesWithoutExamples || []).length / PAGE_SIZE);
    setTotalNoExamplesPages(pages);
    setNoExamplesPage(0); // Reset to page 0, when data changes.
  }, [entriesWithoutExamples]);

  return (
    <Page
      title="User Dashboard"
      tabTitle="User Dashboard - 日本語 Grammar Dictionary"
      menu={<DefaultMenu />}
    >
      <Center>
        <Box maxWidth={1000}>
          <Box mb="1">
            <Link href="/">
              <Button leftIcon={<MdArrowBack />}>Back</Button>
            </Link>
          </Box>
          <Box p="5" shadow="md" bg="white" rounded="md">
            <Flex>
              <Heading>Entries without examples ({entriesWithoutExamples.length})</Heading>
            </Flex>
            <Divider mt="2" mb="2" />
            <Grid templateColumns="repeat(2, 1fr)" gap={5}>
              {noExampleEntries.map((entry) => (
                <Flex
                  key={entry.id}
                  direction="column"
                  p={5}
                  shadow="md"
                  border="1px solid rgba(1, 1, 1, 0.05)"
                  bg="white"
                  rounded="md"
                >
                  <Heading as="h2" size="md">
                    <span dangerouslySetInnerHTML={{ __html: convertFurigana(entry.title) }} />{" "}
                    {entry.descriptors && <Descriptor text={entry.descriptors} />}
                  </Heading>
                  <Divider borderColor="rgb(226, 232, 240)" mt="2" mb="2" />
                  <Text noOfLines={2}>{entry.summary}</Text>
                  <Spacer />
                  <Flex p="5px">
                    <Spacer />
                    <Link href={`/entry/${encodeURIComponent(entry.id)}`}>
                      <Button rightIcon={<MdModeEdit />} colorScheme="gray">
                        Add examples
                      </Button>
                    </Link>
                  </Flex>
                </Flex>
              ))}
            </Grid>
            <Center mt={5}>
              <Stack direction={{ base: "column", sm: "row" }}>
                <HStack>
                  <Button
                    colorScheme="blue"
                    size={buttonSize}
                    minWidth={{ base: "75px", sm: "100px" }}
                    disabled={noExamplesPage <= 0}
                    onClick={() => setNoExamplesPage(0)}
                  >
                    First
                  </Button>
                  <Button
                    colorScheme="blue"
                    size={buttonSize}
                    minWidth={{ base: "75px", sm: "100px" }}
                    disabled={noExamplesPage <= 0}
                    onClick={() => setNoExamplesPage((page) => page - 1)}
                  >
                    Previous
                  </Button>
                </HStack>
                <Box pl="2" pr="2" fontWeight="bold">
                  <Center>{noExamplesPage + 1}</Center>
                </Box>
                <HStack>
                  <Button
                    colorScheme="blue"
                    size={buttonSize}
                    minWidth={{ base: "75px", sm: "100px" }}
                    disabled={noExamplesPage >= totalNoExamplesPages - 1}
                    onClick={() => setNoExamplesPage((page) => page + 1)}
                  >
                    Next
                  </Button>
                  <Button
                    colorScheme="blue"
                    size={buttonSize}
                    minWidth={{ base: "75px", sm: "100px" }}
                    disabled={noExamplesPage >= totalNoExamplesPages - 1}
                    onClick={() => setNoExamplesPage(totalNoExamplesPages - 1)}
                  >
                    Last
                  </Button>
                </HStack>
              </Stack>
            </Center>
          </Box>
        </Box>
      </Center>
    </Page>
  );
};

export default Dashboard;

// --- SERVER SIDE ---

import nookies from "nookies";
import { firebaseAdmin } from "../utils/api/firebaseAdmin";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getEntriesWithFilter } from "./api/entries";
import { useBreakpointValue } from "@chakra-ui/react";

export const getServerSideProps: GetServerSideProps<{ entriesWithoutExamples: EntryData[] }> =
  async (ctx) => {
    try {
      const cookies = nookies.get(ctx);
      const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      const { uid, email } = token;

      // the user is authenticated!
      // FETCH STUFF HERE
      const entriesWithoutExamples = await getEntriesWithFilter({ noExamples: true });

      return {
        props: { entriesWithoutExamples },
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
