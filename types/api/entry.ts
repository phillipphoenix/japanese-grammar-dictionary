import { Example } from "./example";

export type LanguageCodes = "en" | "da";

export type EntryType = {
  id: string;
  tags: string;
  title: { [language in LanguageCodes]: string };
  descriptors: { [language in LanguageCodes]: string };
  descriptionShort: { [language in LanguageCodes]: string };
  examples?: { [language in LanguageCodes]: Example[] };
  rawValues: any;
};
