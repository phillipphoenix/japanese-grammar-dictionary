import { entryConverter } from "../../types/api/firebaseEntryConverter";
import { firebaseAdmin } from "./firebaseAdmin";

const db = firebaseAdmin.firestore();

// All collections with their converters (and other util functions) defined here.
const entries = db.collection("entries").withConverter(entryConverter);

// Object containing all collections and util functions.
const firebaseDb = {
  entries,
};

export default firebaseDb;
