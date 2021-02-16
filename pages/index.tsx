import { useEffect, useState } from "react";
import Link from "next/link";
import Page from "../components/Page";
import styles from "../styles/Home.module.css";
import { Card, CardBody, CardHeader } from "../components/Card/Card";
import { anyLocalisationIncludes } from "../utils/EntryUtils";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getEntries } from "./api/entries";

import {
  Box,
  Wrap,
  WrapItem,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useToken,
} from "@chakra-ui/react";
import { MdSearch, MdLibraryBooks } from "react-icons/md";
import Descriptor from "../components/Descriptor/Descriptor";

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
      anyLocalisationIncludes(entry.title, searchTermLower) ||
      anyLocalisationIncludes(entry.descriptors, searchTermLower) ||
      anyLocalisationIncludes(entry.descriptionShort, searchTermLower)
    );
  });
  return foundEntries.slice(0, 10);
};

export default function Home({ entries }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [search, setSearch] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState([]);

  // Update filtered entries based on entry list and search.
  useEffect(() => {
    const trimmedSearch = search.trim();
    setFilteredEntries(filterEntries(entries, trimmedSearch));
  }, [entries, search]);

  return (
    <Page title="日本語 Grammar Dictionary" tabTitle="日本語 Grammar Dictionary">
      {/* <NarrowContainer className={styles.container}> */}
      <div id="search-area" className={styles.searchArea}>
        <InputGroup className={styles.searchAreaInputGroup}>
          <InputLeftElement
            pointerEvents="none"
            children={<Icon as={MdSearch} color="gray.300" />}
          />
          <Input
            type="text"
            bg="white"
            placeholder="Search here"
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
          />
        </InputGroup>
      </div>
      {filteredEntries.length > 0 && (
        <Box id="entry-list" className={styles.entryList}>
          {filteredEntries.map((entry) => (
            <Card className={styles.entry}>
              <CardHeader>
                {entry.title.da}{" "}
                {entry.descriptors.da && <Descriptor text={entry.descriptors.da} />}
              </CardHeader>
              <CardBody>
                <Box paddingTop={2} paddingBottom={2}>
                  {entry.descriptionShort.da}
                </Box>
                <Wrap paddingTop={2} paddingBottom={2} justify="flex-end">
                  <WrapItem>
                    <Link href={`/entry/${encodeURIComponent(entry.id)}`}>
                      <Button rightIcon={<MdLibraryBooks color="black" />}>Read more</Button>
                    </Link>
                  </WrapItem>
                </Wrap>
              </CardBody>
            </Card>
            // <Link key={entry.id} href={`/entry/${encodeURIComponent(entry.id)}`}>
            //   <div className={styles.entry}>
            //     <EntryCard
            //       title={`${entry.title.da}`}
            //       descriptors={entry.descriptors.da}
            //       descriptionShort={entry.descriptionShort.da}
            //     />
            //   </div>
            // </Link>
          ))}
        </Box>
      )}
      {filteredEntries.length === 0 && (
        <div className={styles.noEntriesFoundContainer}>
          <h3>No entries found...</h3>
        </div>
      )}
      {/* </NarrowContainer> */}
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
