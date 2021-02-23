import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { firebaseAdmin } from "./firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Create cookies instance.
  const cookies = new Cookies(req, res);

  const sessionStr = cookies.get("session");

  return firebaseAdmin
    .auth()
    .verifySessionCookie(sessionStr, true /** checkRevoked */)
    .then((decodedClaims) => decodedClaims)
    .catch((err) => {
      res.redirect("/login");
      res.end();
    });
};
