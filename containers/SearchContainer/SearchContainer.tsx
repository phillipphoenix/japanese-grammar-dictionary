import { useEffect, useState } from "react";
import { FC } from "react";
import Link from "next/link";
import styles from "../../styles/Home.module.css";
import { useFurigana } from "../../hooks/useFurigana";
import { EntryData } from "../../types/components/entryData";
import { filterEntries } from "./searchContainerUtils";

// --- IMPORT COMPONENTS ---

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
  SimpleGrid,
} from "@chakra-ui/react";
import { MdSearch, MdLibraryBooks } from "react-icons/md";
import Page from "../../components/Page";
import Descriptor from "../../components/Descriptor/Descriptor";
import DefaultMenu from "../../components/DefaultMenu/DefaultMenu";

// --- PROP TYPE ---

export interface SearchContainerProps {
  entries: EntryData[];
}

// --- COMPONENT ---

const SearchContainer: FC<SearchContainerProps> = ({ entries }) => {
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
          <SimpleGrid columns={[1, 1, 2, 2, 3]} spacingX="2" spacingY="2">
            {/* <VStack width="100%" spacing="5" alignItems="stretch"> */}
            {filteredEntries.map((entry) => (
              <Flex key={entry.id} direction="column" p={5} shadow="md" bg="white" rounded="md">
                <Heading as="h2" size="md" className={styles.cardHeader}>
                  <span dangerouslySetInnerHTML={{ __html: convertFurigana(entry.title) }} />{" "}
                  {entry.descriptors && <Descriptor text={entry.descriptors} />}
                </Heading>
                <Divider mt="2" mb="2" />
                <Text noOfLines={2}>{entry.summary}</Text>
                <Spacer />
                <Flex p="5px">
                  <Spacer />
                  <Link href={`/entry/${encodeURIComponent(entry.id)}`}>
                    <Button rightIcon={<MdLibraryBooks />} colorScheme="gray">
                      Read more
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            ))}
            {/* </VStack> */}
          </SimpleGrid>
        </Box>
      )}
      {filteredEntries.length === 0 && (
        <div className={styles.noEntriesFoundContainer}>
          <h3>No entries found...</h3>
        </div>
      )}
    </Page>
  );
};

export default SearchContainer;
