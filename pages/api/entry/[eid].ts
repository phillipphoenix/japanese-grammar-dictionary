// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import firestoreDb from "../../../utils/api/firestoreDb";
import { EntryData } from "../../../types/components/entryData";

export const fetchEntry = async (entryId: string): Promise<EntryData> => {
  const docRef = firestoreDb.entries.doc(entryId);

  return docRef.get().then((doc) => {
    if (!doc.exists) {
      throw new Error(`Entry with ID ${entryId} was not found.`);
    }

    return <EntryData>{
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

// -- PUT -- Update entry
const putEntry = async (req: NextApiRequest, res: NextApiResponse) => {
  const entryId = <string>req.query.eid;
  const entry = { ...JSON.parse(req.body), id: entryId } as EntryData;

  if (!entry) {
    res.statusCode = 404;
    res.statusMessage = `No data was given with which to update the entry.`;
    return;
  }

  const docRef = firestoreDb.entries.doc(entryId);
  docRef.set(entry);

  res.statusCode = 200;
  res.json(entry);
};

// -- DELETE -- Delete entry
const deleteEntry = async (req: NextApiRequest, res: NextApiResponse) => {
  const entryId = <string>req.query.eid;

  // Get entry to delete. We will return it after deletion.
  const entry = await fetchEntry(entryId);

  // Get doc ref and delete it.
  const docRef = firestoreDb.entries.doc(entryId);
  docRef.delete();

  res.statusCode = 200;
  res.json(entry);
};

// -- REQUEST RECEIVER --
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return getEntry(req, res);
  } else if (req.method === "PUT") {
    return putEntry(req, res);
  } else if (req.method === "DELETE") {
    return deleteEntry(req, res);
  }

  res.statusCode = 405;
  res.statusMessage = "Method Not Allowed";
  return;
};
