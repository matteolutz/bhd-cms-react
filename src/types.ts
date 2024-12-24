import { ElementType, Ref } from "react";
import { BhdContentBlockWithBlueprint } from "./models";

export type BhdContentBlockComponentFieldProps = {
  "data-bhd-block-id": string;
  "data-bhd-field-name": string;
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
