import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import NarrowContainer from "../../components/NarrowContainer";
import Page from "../../components/Page";
import { EntryType } from "../../types/api/entry";

const Entry = () => {
  const router = useRouter();
  const [entry, setEntry] = useState<EntryType>(null);

  useEffect(() => {
    const { eid } = router.query;
    fetch(`/api/entry/${eid}`)
      .then((result) => result.json())
      .then((entry: EntryType) => {
        setEntry(entry);
      });
  }, [router]);

  return (
    <Page title="日本語 Grammar Entry" tabTitle="Entry: eid">
      <NarrowContainer>
        <div>
          <Link href="/">
            <a>Back</a>
          </Link>
        </div>
        {entry && (
          <div>
            <h1>
              {entry.title.ja} - {entry.title.da} <small>{entry.descriptors.da}</small>
            </h1>
            <p>{entry.descriptionShort.da}</p>
          </div>
        )}
      </NarrowContainer>
    </Page>
  );
};

export default Entry;
