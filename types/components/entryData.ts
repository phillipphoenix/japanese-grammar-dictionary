import { ExampleData } from "./exampleData";

export type EntryData = {
  id?: string;
  tags: string;
  title: string;
  descriptors: string;
  summary: string; // TODO: Rename to "description" at some point.
  description: string; // TODO: Remove summary, when all entries have a description.
  examples: ExampleData[];
  createdAt?: string;
  updatedAt?: string;
};
