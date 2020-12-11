import { ExampleDto } from "./exampleDto";

export type LanguageCodes = "en" | "da";

export type EntryDto = {
  id: string;
  tags: string;
  title: { [language in LanguageCodes]: string };
  descriptors: { [language in LanguageCodes]: string };
  descriptionShort: { [language in LanguageCodes]: string };
  examples?: { [language in LanguageCodes]: ExampleDto[] };
  rawValues: any;
};
