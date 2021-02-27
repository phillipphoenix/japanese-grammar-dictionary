import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

import serviceAccountJson from "./firebaseAdminCredentials";

const serviceAccount = serviceAccountJson as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseAdmin = admin;

export { firebaseAdmin };
