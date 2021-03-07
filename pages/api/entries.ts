// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { userEntryConverter } from "../../types/api/userEntryConverter";
import { EntryData } from "../../types/components/entryData";

import firestoreDb from "../../utils/api/firestoreDb";

export const getEntries = async (): Promise<EntryData[]> => {
  const snapshot = await firestoreDb.entries.get();
  const entryPromises = snapshot.docs.map((doc) => {
    return userEntryConverter.fromFirestore(doc.data());
  });

  return Promise.all(entryPromises);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const entries = await getEntries();

  const entryData = {
    entries,
  };

  res.statusCode = 200;
  res.json(entryData);
};
