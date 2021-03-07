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
  updatedBy?: string; // User display name (is not saved to Firebase).
  updatedByUid?: string; // User ID of the one to either create or last update the entry.
};
