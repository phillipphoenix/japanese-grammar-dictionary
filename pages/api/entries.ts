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

type GetEntriesFilters = {
  noExamples?: boolean;
};

export const getEntriesWithFilter = async (filters: GetEntriesFilters): Promise<EntryData[]> => {
  // Check if any filters are set. If not, just return all entries.
  if (Object.keys(filters).length == 0) {
    return getEntries();
  }

  const snapshot = await firestoreDb.entries.get();
  const entryPromises = snapshot.docs.reduce((acc, doc) => {
    if ((doc.get("examples") as []).length == 0) {
      return [...acc, userEntryConverter.fromFirestore(doc.data())];
    }

    return acc;
  }, []);

  return Promise.all(entryPromises);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const noExamples = req.query.noExamples ? Boolean(req.query.noExamples) : undefined;

  const entries = await getEntriesWithFilter({ noExamples });

  const entryData = {
    entries,
  };

  res.statusCode = 200;
  res.json(entryData);
};
