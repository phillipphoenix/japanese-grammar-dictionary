// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../utils/api/firebaseAdmin";
import Cookies from "cookies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Create cookies instance.
  const cookies = new Cookies(req, res);

  const body = JSON.parse(req.body);
  const { idToken } = body;

  // Guard against CSRF attacks.
  // Get the CSRF token through the body as well.
  // if (csrfToken !== req.cookies.csrfToken) {
  //   res.status(401).send('UNAUTHORIZED REQUEST!');
  //   return;
  // }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  // Create the session cookie. This will also verify the ID token in the process.
  // The session cookie will have the same claims as the ID token.
  // To only allow session cookie setting on recent sign-in, auth_time in ID token
  // can be checked to ensure user was recently signed in before creating a session cookie.
  await firebaseAdmin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        // Set cookie policy for session cookie.
        const options = { expires: new Date(expiresIn), httpOnly: true, secure: true };
        cookies.set("session", sessionCookie, options);
        res.statusCode = 200;
        res.json({ status: "success" });
      },
      (error) => {
        res.statusCode = 401;
        res.send("UNAUTHORIZED REQUEST!");
      }
    );
};
