export type LanguageCodes = "en" | "da" | "ja";

export type EntryType = {
  id: string,
  tags: string,
  title: { [language in LanguageCodes]: string},
  descriptors: { [language in LanguageCodes]: string},
  descriptionShort: { [language in LanguageCodes]: string}
}
