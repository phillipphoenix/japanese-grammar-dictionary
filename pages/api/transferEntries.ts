// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { firebase } from "../../utils/firebaseClient";

import { Coda } from "coda-js";
import {
  DOC_ID,
  ENTRIES_EXAMPLES,
  ENTRIES_TABLE_ID,
  EXAMPLES_TABLE_ID,
  EXAMPLE_TRANSLATION,
  mapToEntry,
  mapToExample,
} from "../../utils/CodaUtils";
import { EntryDto } from "../../types/api/entryDto";

var db = firebase.firestore();

export const createEntries = async (entries: EntryDto[]): Promise<void> => {
  const ref = db.collection("entries");
  const entryPromises = entries.map((entry) => {
    const fbEntry = {
      tags: entry.tags || "",
      title: entry.title?.da || "",
      descriptors: entry.descriptors?.da || "",
      summary: entry.descriptionShort?.da || "",
      examples: entry.examples?.da || [],
    };

    // Check if an entry with the title already exists.
    const query = ref.where("title", "==", fbEntry.title);
    return query.get().then((querySnapshot) => {
      const amountOfDocs = querySnapshot.size;

      // Only add the document, if another with the same title doesn't already exist.
      if (amountOfDocs == 0) {
        return ref.add(fbEntry);
      }
    });
  });

  await Promise.all(entryPromises);
  return;
};

/**
 * Coda with API key.
 */
const coda = new Coda("6aed1ad8-27fa-4f73-9576-26925d112a57");

export const getEntries = async (): Promise<EntryDto[]> => {
  const entriesPromise = coda
    .listRows(DOC_ID, ENTRIES_TABLE_ID, {
      valueFormat: "simpleWithArrays",
    })
    .then((entryRows) => {
      const entries = entryRows.map((row) => mapToEntry(row));
      return entries;
    });

  const allExampleRowsPromise = coda.listRows(DOC_ID, EXAMPLES_TABLE_ID, {});

  return Promise.all([entriesPromise, allExampleRowsPromise]).then(([entries, allExampleRows]) => {
    return entries.map((entry) => {
      const entryExampleTranslations = <string[]>entry.rawValues[ENTRIES_EXAMPLES];
      const exampleRows = allExampleRows.filter((er) =>
        entryExampleTranslations.includes(er.values[EXAMPLE_TRANSLATION])
      );
      if (exampleRows && exampleRows.length > 0) {
        const examples = exampleRows.map((er) => mapToExample(er));
        entry.examples = {
          en: examples,
          da: examples,
        };
      }
      return entry;
    });
  });
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const entries = await getEntries();
    await createEntries(entries);
  } catch {
    res.statusCode = 500;
    return;
  }

  res.statusCode = 200;
};
