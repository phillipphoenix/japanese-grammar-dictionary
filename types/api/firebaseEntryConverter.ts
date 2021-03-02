import { EntryData } from "../components/entryData";
import { firestore } from "firebase-admin";

const entryConverter: firestore.FirestoreDataConverter<EntryData> = {
  toFirestore(entry: EntryData): firestore.DocumentData {
    // Remove the ID from the object.
    const { id, ...entryRest } = entry;
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
