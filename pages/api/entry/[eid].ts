// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { firebase } from "../../../utils/firebaseClient";
import { EntryDto } from "../../../types/api/entryDto";

var db = firebase.firestore();

export const fetchEntry = async (entryId: string): Promise<EntryDto> => {
  const ref = db.collection("entries");
  const docRef = ref.doc(entryId);

  return docRef.get().then((doc) => {
    if (!doc.exists) {
      throw new Error(`Entry with ID ${entryId} was not found.`);
    }
    return <EntryDto>{
      ...doc.data(),
      id: doc.id,
    };
  });
};

// -- GET -- Fetch entry.
const getEntry = async (req: NextApiRequest, res: NextApiResponse) => {
  const entryId = <string>req.query.eid;

  const entry = await fetchEntry(entryId);

  if (!entry) {
    res.statusCode = 404;
    res.statusMessage = `Entry with ID ${entryId} was not found.`;
  } else {
    res.statusCode = 200;
    res.json(entry);
  }
};

// -- POST -- Create entry

// -- PUT -- Update entry

// -- DELETE -- Delete entry

// -- REQUEST RECEIVER --
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    getEntry(req, res);
    return;
  }
};
