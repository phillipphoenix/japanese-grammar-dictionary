import { EntryData } from "../components/entryData";
import { firestore } from "firebase-admin";

const entryConverter: firestore.FirestoreDataConverter<EntryData> = {
  toFirestore(entry: EntryData): firestore.DocumentData {
    // Check if there is a updatedByUid attribute and throw exception if there is not.
    if (!entry.updatedByUid) {
      throw Error("A user ID is required on the object, before it can be saved.");
    }
    // Remove the ID and updatedBy (only save display name) from the object.
    const { id, updatedBy, ...entryRest } = entry;
    const newDate = new Date();
    return {
      ...entryRest,
      createdAt: entryRest.createdAt ? new Date(entryRest.createdAt) : newDate,
      updatedAt: newDate,
    };
  },
  fromFirestore(snapshot: firestore.QueryDocumentSnapshot): EntryData {
    const data = snapshot.data();
    const { createdAt, updatedAt, ...dataRest } = data;
    return <EntryData>{
      id: snapshot.id,
      ...dataRest,
      createdAt: createdAt?.toDate().toString() || null,
      updatedAt: updatedAt?.toDate().toString() || null,
    };
  },
};

export { entryConverter };
