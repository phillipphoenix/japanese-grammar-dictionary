// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { firebase } from "../../../utils/firebase";
import { EntryDto } from "../../../types/api/entryDto";

var db = firebase.firestore();

export const getEntry = async (entryId: string): Promise<EntryDto> => {
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const entryId = <string>req.query.eid;

  const entry = await getEntry(entryId);

  if (!entry) {
    res.statusCode = 404;
    res.statusMessage = `Entry with ID ${entryId} was not found.`;
  } else {
    res.statusCode = 200;
    res.json(entry);
  }
};
