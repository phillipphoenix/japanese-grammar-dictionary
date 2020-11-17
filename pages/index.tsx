import { useEffect, useState } from "react";
import Link from "next/link";
import NarrowContainer from "../components/NarrowContainer";
import Page from "../components/Page";
import styles from "../styles/Home.module.css";
import EntryCard from "../components/EntryCard";
import { EntryType } from "../types/api/entry";
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
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [filteredEntries, setFilteredEntries] = useState([]);

  useEffect(() => {
    fetch("/api/entries")
      .then((result) => result.json())
      .then((entryData) => entryData.entries as EntryType[])
      .then((entries) => {
        setEntries(entries);
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
        {filteredEntries.length > 0 && (
          <div id="entry-list" className={styles.entryList}>
            {filteredEntries.map((entry) => (
              <Link key={entry.id} href={`/entry/${encodeURIComponent(entry.id)}`}>
                <div className={styles.entry}>
                  <EntryCard
                    title={`${entry.title.ja} - ${entry.title.da}`}
                    descriptors={entry.descriptors.da}
                    description={entry.descriptionShort.da}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
        {filteredEntries.length === 0 && (
          <div className={styles.noEntriesFoundContainer}>
            <h3>No entries found...</h3>
          </div>
        )}
      </NarrowContainer>
    </Page>
  );
}
