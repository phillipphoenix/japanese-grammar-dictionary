import { Row } from "coda-js/build/models";
import { EntryType } from "../types/api/entry";
import { Example } from "../types/api/example";

export const DOC_ID = "JLcxuFVrLM";

// Entries column IDs.
export const ENTRIES_TABLE_ID = "Entries";
export const ENTRIES_TAGS = "c-7Op-AwoIfq";
export const ENTRIES_TITLE = "c-YV2T7z0sjb";
export const ENTRIES_DESCRIPTORS = "c-tOEutHWdy3";
export const ENTRIES_DESCRIPTION_SHORT = "c-3Gn4wVV2bK";
export const ENTRIES_EXAMPLES = "c-SRJrXmcObY";

export const mapToEntry = (row: Row): EntryType => {
  return <EntryType>{
    id: row.id,
    tags: row.values[ENTRIES_TAGS],
    title: {
      en: row.values[ENTRIES_TITLE],
      da: row.values[ENTRIES_TITLE],
    },
    descriptors: {
      en: row.values[ENTRIES_DESCRIPTORS],
      da: row.values[ENTRIES_DESCRIPTORS],
    },
    descriptionShort: {
      en: row.values[ENTRIES_DESCRIPTION_SHORT],
      da: row.values[ENTRIES_DESCRIPTION_SHORT],
    },
    rawValues: row.values,
  };
};

// Examples column IDs.
export const EXAMPLES_TABLE_ID = "Examples";
export const EXAMPLE_SENTENCE = "c-h-i94MSMFW";
export const EXAMPLE_TRANSLATION = "c-R1uyV8Z1Dx";
export const EXAMPLE_EXPLANATION = "c-02_uvYMMU9";

export const mapToExample = (row: Row): Example => {
  return <Example>{
    id: row.id,
    sentence: row.values[EXAMPLE_SENTENCE],
    translation: row.values[EXAMPLE_TRANSLATION],
    explanation: row.values[EXAMPLE_EXPLANATION],
  };
};
