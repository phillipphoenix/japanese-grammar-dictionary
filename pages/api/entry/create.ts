// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

import { firebase } from "../../../utils/firebaseClient";

var db = firebase.firestore();

// -- POST -- Create entry
const postEntry = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, descriptors, description, tags } = JSON.parse(req.body);

  const newEntry = {
    title,
    descriptors,
    summary: description,
    description,
    tags,
  };

  const ref = db.collection("entries");
  try {
    const result = await ref.add(newEntry);
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
