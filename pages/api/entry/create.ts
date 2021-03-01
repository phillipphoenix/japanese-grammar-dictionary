// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import { EntryData } from "../../../types/components/entryData";

import firestoreDb from "../../../utils/api/firestoreDb";

// -- POST -- Create entry
const postEntry = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, descriptors, summary, description, tags } = JSON.parse(req.body);

  const newEntry: EntryData = {
    title,
    descriptors,
    summary: description || summary,
    description: description || summary,
    tags,
    examples: [],
  };

  try {
    const result = await firestoreDb.entries.add(newEntry);
    res.statusCode = 200;
    res.json({ id: result.id, message: "Entry created succesfully!" });
    return;
  } catch (err) {
    res.statusCode = 500;
    res.statusMessage = "An error occurred, while creating the entry.";
  }
};

// -- REQUEST RECEIVER --
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    postEntry(req, res);
    return;
  }

  res.statusCode = 400;
  res.statusMessage = "Bad Request Method";
};
