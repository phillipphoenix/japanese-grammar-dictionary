import { firebaseAdmin } from "../../utils/api/firebaseAdmin";
import { EntryData } from "../components/entryData";

/**
 * Converts from updatedByUid to updatedBy (from user ID to user display name).
 */
export const userEntryConverter = {
  fromFirestore: async (entry: EntryData): Promise<EntryData> => {
    // Also remove the UID from the entry (here using the spread to get the rest).
    const { updatedByUid, ...entryRest } = entry;
    if (!!updatedByUid) {
      const user = await firebaseAdmin.auth().getUser(updatedByUid);
      const { displayName } = user;
      return {
        ...entryRest,
        updatedBy: displayName,
      };
    }
    return entryRest;
  },
};
