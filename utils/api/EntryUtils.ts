import { LanguageCodes } from "../types/api/entryDto";

/**
 * Returns true if any of the localised texts in the entry's prop contain the search string.
 * False otherwise.
 * @param entryPropLocalised
 * @param searchString
 */
export const anyLocalisationIncludes = (
  entryPropLocalised: { [language in LanguageCodes]: string },
  searchString: string
): boolean => {
  // Get all available language codes.
  const langCodes = Object.keys(entryPropLocalised);
  // Loop over them all and search. Return true immediately, if match found.
  for (let i = 0; i < langCodes.length; i++) {
    const langCode = langCodes[i];
    const text = entryPropLocalised[langCode];
    // Return true, if text includes search string.
    if (text.includes(searchString)) {
      return true;
    }
  }
  // Return false, if not found.
  return false;
};
