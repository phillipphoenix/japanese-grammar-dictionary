import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import NarrowContainer from "../components/NarrowContainer";
import Page from "../components/Page";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    fetch("/api/entries")
      .then((result) => result.json())
      .then((entryData) => entryData.entries)
      .then((entries) => {
        setEntries(entries);
      });
  }, []);

  return (
    <Page title="日本語 Grammar Dictionary" tabTitle="日本語 Grammar Dictionary">
      <NarrowContainer>
        <div id="search-area" className={styles.searchArea}>
          <input type="text" placeholder="Search here" />
        </div>
        <div id="entry-list" className={styles.entryList}>
          {entries.map((entry) => (
            <Link key={entry.id} href={`/entry/${encodeURIComponent(entry.id)}`}>
              <div className={styles.entry}>
                {entry.title.ja} {entry.title.da}
              </div>
            </Link>
          ))}
        </div>
      </NarrowContainer>
    </Page>
  );
}
