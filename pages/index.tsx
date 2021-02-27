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
  Text,
  VStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getEntries } from "./api/entries";

import { MdSearch, MdLibraryBooks, MdAdd, MdMenu, MdPerson } from "react-icons/md";
import Descriptor from "../components/Descriptor/Descriptor";
import { useAuth } from "../Providers/AuthProvider";
import { firebase } from "../utils/firebaseClient";
import { useRouter } from "next/router";
import DefaultMenu from "../components/DefaultMenu/DefaultMenu";

const filterEntries = (allEntries, searchTerm) => {
  // If search is empty, take 10 first entries.
  if (!searchTerm) {
    return allEntries.slice(0, 10);
  }
  // Only return the 10 first entries that match the search.
  const searchTermLower = searchTerm.toLowerCase();
  const foundEntries = allEntries.filter((entry) => {
    return (
      entry.tags.includes(searchTermLower) ||
      entry.title.includes(searchTermLower) ||
      entry.descriptors.includes(searchTermLower) ||
      entry.summary.includes(searchTermLower)
    );
  });
  return foundEntries.slice(0, 10);
};

export default function Home({ entries }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { user } = useAuth();
  const { reload } = useRouter();
  const [search, setSearch] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState([]);

  const onLogOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        reload();
      });
  };

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
      {filteredEntries.length > 0 && (
        <Box id="entry-list" className={styles.entryList}>
          {filteredEntries.map((entry) => (
            <Box key={entry.id} mb="5" p={5} shadow="md" bg="white" rounded="md">
              <Heading as="h2" size="md" className={styles.cardHeader}>
                {entry.title} {entry.descriptors && <Descriptor text={entry.descriptors} />}
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
export const getStaticProps: GetStaticProps = async (context) => {
  const entries = await getEntries();

  return {
    props: { entries },
    revalidate: 60 * 10, // Rerender every 10 minutes (upon request).
  };
};
