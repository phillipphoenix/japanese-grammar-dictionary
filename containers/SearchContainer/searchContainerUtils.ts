import "ts-array-ext/shuffle";
import { EntryData } from "../../types/components/entryData";

export const filterEntries = (allEntries: EntryData[], searchTerm: string) => {
  if (!allEntries || allEntries.length === 0) {
    return [];
  }

  // If search is empty, take 10 random entries.
  if (!searchTerm) {
    // Shuffle to get random entries.
    return [...allEntries].shuffle().slice(0, 10);
  }
  // Only return the 10 first entries that match the search.
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
  return foundEntries.slice(0, 10);
};
