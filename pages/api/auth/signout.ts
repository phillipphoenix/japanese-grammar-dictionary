// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";
import { firebaseAdmin } from "../../../utils/api/firebaseAdmin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Create cookies instance.
  const cookies = new Cookies(req, res);

  // Get current session cookie.
  const sessionStr = cookies.get("session");

  // Setting cookie without value will delete cookie.
  cookies.set("session");

  await firebaseAdmin
    .auth()
    .verifySessionCookie(sessionStr)
    .then((decodedClaims) => {
      return firebaseAdmin.auth().revokeRefreshTokens(decodedClaims.sub);
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((error) => {
      res.redirect("/login");
    });
};
