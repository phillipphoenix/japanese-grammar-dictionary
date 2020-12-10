// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import entryData from "../entryData.json";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const entryId = req.query.eid;
  const entry = entryData.entries.find(e => e.id === entryId);

  if (!entry) {
    res.statusCode = 404;
    res.statusMessage = `Entry with ID ${entryId} was not found.`;
  } else {
    res.statusCode = 200;
    res.json(entry);
  }
}
