// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { firebase } from "../../utils/firebaseClient";

import { EntryDto } from "../../types/api/entryDto";

var db = firebase.firestore();

export const getEntries = async (): Promise<EntryDto[]> => {
  const ref = db.collection("entries");
  const snapshot = await ref.get();
  const entries = snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return entries;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const entries = await getEntries();

  const entryData = {
    entries,
  };

  res.statusCode = 200;
  res.json(entryData);
};
