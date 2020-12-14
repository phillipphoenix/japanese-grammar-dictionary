import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import styles from "../../styles/[eid].module.css";
import NarrowContainer from "../../components/NarrowContainer";
import Page from "../../components/Page";
import EntryCard, { EntryCardSkeleton } from "../../components/EntryCard";
import { Card, CardBody, CardHeader } from "../../components/Card";
import { getEntry } from "../api/entry/[eid]";
import { getEntries } from "../api/entries";
import ArrowLeft from "../../svgs/ArrowLeft";

const Entry = ({ entry }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { isFallback } = useRouter();

  return (
    <Page title="日本語 Grammar Entry" tabTitle="Entry: eid">
      <NarrowContainer>
        <div>
          <Link href="/">
            <a>
              <ArrowLeft className={styles.textSvgs} /> Back
            </a>
          </Link>
        </div>

        <div className={styles.cardList}>
          {isFallback && <EntryCardSkeleton />}
          {!isFallback && entry && (
            <>
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
            </>
          )}
        </div>
      </NarrowContainer>
    </Page>
  );
};

// Server side render and cache content.
export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await getEntries();

  const paths = entries.map((entry) => ({ params: { eid: entry.id } }));

  return {
    paths,
    fallback: true,
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
