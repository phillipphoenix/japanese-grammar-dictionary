import { useEffect, useState } from "react";
import Link from "next/link";
import Page from "../components/Page";
import styles from "../styles/Home.module.css";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Spacer,
  Icon,
  Text,
  VStack,
  Center,
} from "@chakra-ui/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getEntries } from "./api/entries";

import { MdSearch, MdLibraryBooks } from "react-icons/md";
import Descriptor from "../components/Descriptor/Descriptor";
import DefaultMenu from "../components/DefaultMenu/DefaultMenu";
import { EntryData } from "../types/components/entryData";

import "ts-array-ext/shuffle";
import { useFurigana } from "../hooks/useFurigana";

const filterEntries = (allEntries: EntryData[], searchTerm: string) => {
  if (!allEntries || allEntries.length === 0) {
    return [];
  }

  // If search is empty, take 10 random entries.
  if (!searchTerm) {
    // Shuffle to get random entries.
    return [...allEntries].shuffle().slice(0, 10);
  }
  // Only return the 10 first entries that match the search.
  const searchTermLower = searchTerm.toLowerCase();
  const foundEntries = allEntries.filter((entry) => {
    return (
      !!entry &&
      (entry.tags?.includes(searchTermLower) ||
        entry.title?.includes(searchTermLower) ||
        entry.descriptors?.includes(searchTermLower) ||
        entry.summary?.includes(searchTermLower))
    );
  });
  return foundEntries.slice(0, 10);
};

export default function Home({ entries }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [convertFurigana] = useFurigana();

  // Update filtered entries based on entry list and search.
  useEffect(() => {
    const trimmedSearch = search.trim();
    setFilteredEntries(filterEntries(entries, trimmedSearch));
  }, [entries, search]);

  return (
    <Page
      title="日本語 Grammar Dictionary"
      tabTitle="日本語 Grammar Dictionary"
      menu={<DefaultMenu />}
    >
      <Box id="search-area" className={styles.searchArea}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={MdSearch} color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Search here"
            backgroundColor="white"
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
          />
        </InputGroup>
      </Box>
      {!search.trim() && (
        <Center>
          <Text mt="-5" mb="5" color="gray.400" fontSize="xs">
            Displaying randomised entries
          </Text>
        </Center>
      )}
      {filteredEntries.length > 0 && (
        <Box id="entry-list" className={styles.entryList}>
          <VStack width="100%" spacing="5" alignItems="stretch">
            {filteredEntries.map((entry) => (
              <Box key={entry.id} p={5} shadow="md" bg="white" rounded="md">
                <Heading as="h2" size="md" className={styles.cardHeader}>
                  <span dangerouslySetInnerHTML={{ __html: convertFurigana(entry.title) }} />{" "}
                  {entry.descriptors && <Descriptor text={entry.descriptors} />}
                </Heading>
                <Divider mt="2" mb="2" />
                <Box>{entry.summary}</Box>
                <Flex p="5px">
                  <Spacer />
                  <Link href={`/entry/${encodeURIComponent(entry.id)}`}>
                    <Button rightIcon={<MdLibraryBooks />} colorScheme="gray">
                      Read more
                    </Button>
                  </Link>
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
      {filteredEntries.length === 0 && (
        <div className={styles.noEntriesFoundContainer}>
          <h3>No entries found...</h3>
        </div>
      )}
    </Page>
  );
}

// Server side render with all entries at build time.
export const getStaticProps: GetStaticProps<{ entries: EntryData[] }> = async (context) => {
  const entries = await getEntries();

  return {
    props: { entries },
    revalidate: 60 * 10, // Rerender every 10 minutes (upon request).
  };
};
