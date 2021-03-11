import { GetStaticProps, InferGetStaticPropsType } from "next";
import { getEntries } from "./api/entries";
import { EntryData } from "../types/components/entryData";

import SearchContainer from "../containers/SearchContainer/SearchContainer";

export default function Home({ entries }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SearchContainer entries={entries} />;
}

// Server side render with all entries at build time.
export const getStaticProps: GetStaticProps<{ entries: EntryData[] }> = async (context) => {
  const entries = await getEntries();

  return {
    props: { entries },
    revalidate: 60 * 1, // Rerender every 1 minutes (upon request).
  };
};
