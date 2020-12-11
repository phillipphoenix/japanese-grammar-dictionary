import { ExampleData } from "./exampleData";

export type EntryData = {
  id: string;
  tags: string;
  title: string;
  descriptors: string;
  descriptionShort: string;
  examples: ExampleData[];
};
