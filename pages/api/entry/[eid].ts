// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { Coda } from "coda-js";
import {
  DOC_ID,
  ENTRIES_EXAMPLES,
  ENTRIES_TABLE_ID,
  EXAMPLES_TABLE_ID,
  EXAMPLE_TRANSLATION,
  mapToEntry,
  mapToExample,
} from "../../../utils/CodaUtils";

/**
 * Coda with API key.
 */
const coda = new Coda("6aed1ad8-27fa-4f73-9576-26925d112a57");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const entryId = <string>req.query.eid;

  const entryRow = await coda.getRow(DOC_ID, ENTRIES_TABLE_ID, entryId, {
    valueFormat: "simpleWithArrays",
  });
  const entryExampleTranslations = <string[]>entryRow.values[ENTRIES_EXAMPLES];
  const allExampleRows = await coda.listRows(DOC_ID, EXAMPLES_TABLE_ID, {});
  const exampleRows = allExampleRows.filter((er) =>
    entryExampleTranslations.includes(er.values[EXAMPLE_TRANSLATION])
  );

  const entry = mapToEntry(entryRow);
  if (exampleRows && exampleRows.length > 0) {
    const examples = exampleRows.map((er) => mapToExample(er));
    entry.examples = {
      en: examples,
      da: examples,
    };
  }

  if (!entry) {
    res.statusCode = 404;
    res.statusMessage = `Entry with ID ${entryId} was not found.`;
  } else {
    res.statusCode = 200;
    res.json(entry);
  }
};
