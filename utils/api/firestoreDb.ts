import { entryConverter } from "../../types/api/firebaseEntryConverter";
import { firebaseAdmin } from "./firebaseAdmin";

const db = firebaseAdmin.firestore();

const firebaseDb = {
  entries: db.collection("entries").withConverter(entryConverter),
};

export default firebaseDb;
