import { ElementType, Ref } from "react";
import { BhdContentBlockWithBlueprint } from "./models";

export type BhdContentBlockComponentFieldProps = {
  "data-bhdBlockId": string;
  "data-bhdFieldName": string;
};

export type BhdContentBlockComponentProps = {
  contentBlock: BhdContentBlockWithBlueprint;
  bhdProps: (fieldName: string) => BhdContentBlockComponentFieldProps;
  loadingComponent: ElementType;
  ref: Ref<HTMLElement>;
};

export type BhdBlueprintLut = Record<
  string,
  ElementType<BhdContentBlockComponentProps>
>;
