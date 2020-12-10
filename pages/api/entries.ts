// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { Coda } from "coda-js";
import { mapToEntry } from "../../utils/CodaUtils";

/**
 * Coda with API key.
 */
const coda = new Coda("6aed1ad8-27fa-4f73-9576-26925d112a57");

// Document and table IDs/Names
const DOC_ID = "JLcxuFVrLM";
const ENTRIES_TABLE_ID = "Entries";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const table = await coda.getTable(DOC_ID, ENTRIES_TABLE_ID);
  const rows = await table.listRows({
    valueFormat: "simpleWithArrays",
  });

  const entries = rows.map((row) => mapToEntry(row));

  const entryData = {
    entries,
  };

  res.statusCode = 200;
  res.json(entryData);
};
