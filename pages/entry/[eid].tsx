import Link from "next/link";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import styles from "../../styles/[eid].module.css";
import NarrowContainer from "../../components/NarrowContainer";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Page from "../../components/Page";
import { EntryDto } from "../../types/api/entryDto";
import EntryCard from "../../components/EntryCard";
import { Card, CardBody, CardHeader, CardSkeleton } from "../../components/Card";
import { getEntry } from "../api/entry/[eid]";
import { getEntries } from "../api/entries";

const Entry = ({ entry }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [entry, setEntry] = useState<EntryDto>(null);

  // useEffect(() => {
  //   const { eid } = router.query;
  //   // Only fetch data, when query param is properly set.
  //   if (!eid) {
  //     return;
  //   }
  //   setIsLoading(true);
  //   fetch(`/api/entry/${eid}`)
  //     .then((result) => result.json())
  //     .then((entry: EntryDto) => {
  //       console.log("EntryData:", entry);
  //       setEntry(entry);
  //       setIsLoading(false);
  //     });
  // }, [router]);

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
          <div className={styles.cardList}>
            <EntryCard
              className={styles.card}
              title={`${entry.title.da}`}
              descriptors={entry.descriptors.da}
              descriptionShort={entry.descriptionShort.da}
            />
            {entry.examples?.da && (
              <Card className={styles.card}>
                <CardHeader>
                  <h2>Examples</h2>
                </CardHeader>
                <CardBody>
                  {entry.examples.da.map((exmp) => (
                    <div key={exmp.id} className={styles.example}>
                      <p>{exmp.sentence}</p>
                      <p>{exmp.translation}</p>
                      {!exmp.explanation && (
                        <p className={styles.explanation}>{exmp.explanation}</p>
                      )}
                    </div>
                  ))}
                </CardBody>
              </Card>
            )}
          </div>
        )}
      </NarrowContainer>
    </Page>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getEntries();

  const paths = entries.map((entry) => ({ params: { eid: entry.id } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const eid = context.params.eid as string;

  const entry = await getEntry(eid);

  return {
    props: { entry },
    revalidate: 60 * 10, // Rerender every 10 minutes (upon request).
  };
};

export default Entry;
