import { useEffect, useState } from "react";
import Link from "next/link";
import NarrowContainer from "../components/NarrowContainer";
import Page from "../components/Page";
import styles from "../styles/Home.module.css";
import EntryCard, { EntryCardSkeleton } from "../components/EntryCard";
import { EntryDto } from "../types/api/entryDto";
import { anyLocalisationIncludes } from "../utils/EntryUtils";

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

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [entries, setEntries] = useState<EntryDto[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/entries")
      .then((result) => result.json())
      .then((entryData) => entryData.entries as EntryDto[])
      .then((entries) => {
        setEntries(entries);
        setIsLoading(false);
      });
  }, []);

  // Update filtered entries based on entry list and search.
  useEffect(() => {
    const trimmedSearch = search.trim();
    setFilteredEntries(filterEntries(entries, trimmedSearch));
  }, [entries, search]);

  return (
    <Page title="日本語 Grammar Dictionary" tabTitle="日本語 Grammar Dictionary">
      <NarrowContainer className={styles.container}>
        <div id="search-area" className={styles.searchArea}>
          <input
            type="text"
            placeholder="Search here"
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
          />
        </div>
        {isLoading && (
          <div className={styles.noEntriesFoundContainer}>
            {/* <h3>Loading entries...</h3> */}
            <div id="entry-list" className={styles.entryList}>
              {[...Array(3)].map((e, idx) => (
                <div key={idx} className={styles.entry}>
                  <EntryCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        )}
        {!isLoading && filteredEntries.length > 0 && (
          <div id="entry-list" className={styles.entryList}>
            {filteredEntries.map((entry) => (
              <Link key={entry.id} href={`/entry/${encodeURIComponent(entry.id)}`}>
                <div className={styles.entry}>
                  <EntryCard
                    title={`${entry.title.da}`}
                    descriptors={entry.descriptors.da}
                    description={entry.descriptionShort.da}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
        {!isLoading && filteredEntries.length === 0 && (
          <div className={styles.noEntriesFoundContainer}>
            <h3>No entries found...</h3>
          </div>
        )}
      </NarrowContainer>
    </Page>
  );
}
