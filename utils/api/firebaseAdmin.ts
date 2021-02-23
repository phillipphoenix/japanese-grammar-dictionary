import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

import serviceAccountJson from "./japanese-grammar-dictionary-firebase-adminsdk-a9rk7-bcdc47bb3c.json";

const serviceAccount = serviceAccountJson as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseAdmin = admin;

export { firebaseAdmin };
