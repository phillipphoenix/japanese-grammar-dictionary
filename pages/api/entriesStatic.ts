// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import entryData from "./entryData.json";

export default async (req, res) => {
  res.statusCode = 200;
  res.json(entryData);
}
