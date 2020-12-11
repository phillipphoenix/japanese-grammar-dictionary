import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import NarrowContainer from "../../components/NarrowContainer";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Page from "../../components/Page";
import { EntryDto } from "../../types/api/entryDto";

const Entry = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [entry, setEntry] = useState<EntryDto>(null);

  useEffect(() => {
    const { eid } = router.query;
    // Only fetch data, when query param is properly set.
    if (!eid) {
      return;
    }
    setIsLoading(true);
    fetch(`/api/entry/${eid}`)
      .then((result) => result.json())
      .then((entry: EntryDto) => {
        console.log("EntryData:", entry);
        setEntry(entry);
        setIsLoading(false);
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
        {isLoading && (
          <div>
            {/* <h3>Loading entry...</h3> */}
            <SkeletonTheme color="#404040" highlightColor="#696969">
              <h1>
                <Skeleton />
              </h1>
              <Skeleton count={3} />
            </SkeletonTheme>
          </div>
        )}
        {!isLoading && entry && (
          <div>
            <h1>
              {entry.title.da} <small>{entry.descriptors.da}</small>
            </h1>
            <p>{entry.descriptionShort.da}</p>
            {entry.examples && (
              <div>
                <h3>Examples</h3>
                {entry.examples.da.map((exmp) => (
                  <div key={exmp.id}>
                    <p>{exmp.sentence}</p>
                    <p>{exmp.translation}</p>
                    <p>{exmp.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </NarrowContainer>
    </Page>
  );
};

export default Entry;
