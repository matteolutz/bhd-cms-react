export type BhdContentBlockBlueprint = {
  id: string;
  name: string;
  type: "PAGE" | "UI_COMPONENT" | "CONFIG";

  tag?: string;

  schema: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;

  projectId: string;
};
