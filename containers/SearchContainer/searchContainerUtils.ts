import "ts-array-ext/shuffle";
import { EntryData } from "../../types/components/entryData";

export type FilterEntriesOptions = {
  /**
   * Current page to get.
   */
  page: number;
  /**
   * Amount of items per page (default is 9).
   */
  pageSize: number;
  /**
   * When no search query given, should the filter return random entries (shuffled) or just in default order?
   */
  shuffleWhenNoSearch: boolean;
};

export type FilterEntriesData = {
  pageEntries: EntryData[];
  pages: number;
  totalEntries: number;
};

export const filterEntries = (
  allEntries: EntryData[],
  searchTerm: string,
  { page = 0, pageSize = 9, shuffleWhenNoSearch = true }: Partial<FilterEntriesOptions> = {}
): FilterEntriesData => {
  if (!allEntries || allEntries.length === 0) {
    return {
      pageEntries: [],
      pages: 0,
      totalEntries: 0,
    };
  }

  const currentStartingEntry = page * pageSize;
  const currentEndingEntry = currentStartingEntry + pageSize;

  // If search is empty, take some random entries (based on page number and size).
  if (!searchTerm) {
    const allCopiedEntries = shuffleWhenNoSearch ? [...allEntries].shuffle() : [...allEntries];
    const pageEntries = allCopiedEntries.slice(currentStartingEntry, currentEndingEntry);

    return {
      pageEntries,
      pages: Math.ceil(allCopiedEntries.length / pageSize),
      totalEntries: allCopiedEntries.length,
    };
  }
  // Only return entries that match the search (based on page number and size).
  const searchTermLower = searchTerm.toLowerCase();
  const foundEntries = allEntries.filter((entry) => {
    return (
      !!entry &&
      (entry.tags?.includes(searchTermLower) ||
        entry.title?.includes(searchTermLower) ||
        entry.descriptors?.includes(searchTermLower) ||
        entry.summary?.includes(searchTermLower))
    );
  });

  const pageEntries = foundEntries.slice(currentStartingEntry, currentEndingEntry);

  return {
    pageEntries,
    pages: Math.ceil(foundEntries.length / pageSize),
    totalEntries: foundEntries.length,
  };
};
