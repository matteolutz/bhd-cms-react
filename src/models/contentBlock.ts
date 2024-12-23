import { BhdContentBlockBlueprint } from "./contentBlockBlueprint";

export type BhdContentBlock = {
  id: string;
  name: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  content: any;

  createdAt: string;
  updatedAt: string;

  contentBlockBlueprintId: string;
};

export type BhdContentBlockWithBlueprint = BhdContentBlock & {
  contentBlockBlueprint: Pick<
    BhdContentBlockBlueprint,
    "projectId" | "tag" | "name"
  >;
};
