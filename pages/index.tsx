import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NarrowContainer from "../components/NarrowContainer";
import Page from "../components/Page";
import styles from "../styles/Home.module.css";
import EntryCard from "../components/EntryCard";
import { EntryType } from "../types/api/entry";
import { anyLocalisationIncludes } from "../utils/EntryUtils";

export default function Home() {
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchTrimmed, setSearchTrimmed] = useState<string>("");

  useEffect(() => {
    fetch("/api/entries")
      .then((result) => result.json())
      .then((entryData) => entryData.entries as EntryType[])
      .then((entries) => {
        setEntries(entries);
      });
  }, []);

  useEffect(() => {
    const trimmedSearch = search.trim();
    if (trimmedSearch !== searchTrimmed) {
      setSearchTrimmed(trimmedSearch);
    }
  }, [search]);

  const filteredEntries = () => {
    // If search is empty, take 10 first entries.
    if (!searchTrimmed) {
      return entries.slice(0, 10);
    }
    // Only return the 10 first entries that match the search.
    const foundEntries = entries.filter((entry) => {
      return (
        entry.tags.includes(searchTrimmed) ||
        anyLocalisationIncludes(entry.title, searchTrimmed) ||
        anyLocalisationIncludes(entry.descriptors, searchTrimmed) ||
        anyLocalisationIncludes(entry.descriptionShort, searchTrimmed)
      );
    });
    return foundEntries.slice(0, 10);
  };

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
        <div id="entry-list" className={styles.entryList}>
          {filteredEntries().map((entry) => (
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
      </NarrowContainer>
    </Page>
  );
}
