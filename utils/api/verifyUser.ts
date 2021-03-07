import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "./firebaseAdmin";

/**
 * Returns null, if the user is not verified. It will set status code and message, so it's safe to just return.
 * Will return a promise containing an object with user info, if user is logged in.
 * @param req
 * @param res
 */
export const verifyUser = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{
  uid: string;
  displayName?: string;
  email: string;
  picture?: string;
  phoneNumber?: string;
} | null> => {
  return firebaseAdmin
    .auth()
    .verifyIdToken(req.cookies.token)
    .then((token) => {
      const { uid, name, email, picture, phone_number } = token;

      console.log("USER FOUNT", token);

      if (!uid) {
        throw Error("User ID was not found.");
      }

      return {
        uid,
        displayName: name,
        email,
        picture,
        phoneNumber: phone_number,
      };
    })
    .catch((err) => {
      res.statusCode = 401;
      res.statusMessage = "UNAUTHORISED!";
      return null;
    });
};
