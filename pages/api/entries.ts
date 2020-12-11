// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { Coda } from "coda-js";
import { mapToEntry } from "../../utils/CodaUtils";
import { EntryDto } from "../../types/api/entryDto";

/**
 * Coda with API key.
 */
const coda = new Coda("6aed1ad8-27fa-4f73-9576-26925d112a57");

// Document and table IDs/Names
const DOC_ID = "JLcxuFVrLM";
const ENTRIES_TABLE_ID = "Entries";

export const getEntries = (): Promise<EntryDto[]> => {
  return coda
    .listRows(DOC_ID, ENTRIES_TABLE_ID, {
      valueFormat: "simpleWithArrays",
    })
    .then((entryRows) => {
      const entries = entryRows.map((row) => mapToEntry(row));
      return entries;
    });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const entries = await getEntries();

  const entryData = {
    entries,
  };

  res.statusCode = 200;
  res.json(entryData);
};
