import { ElementType, Ref } from "react";
import { BhdContentBlockWithBlueprint } from "./models";

export type BhdContentBlockComponentFieldProps = {
  "data-bhd-field-name": string;
};
export type BhdContentBlockComponentRootProps = {
  "data-bhd-block-id": string;
  "data-bhd-block-parent-field-name"?: string;
};

export type BhdContentBlockComponentProps = {
  contentBlock: BhdContentBlockWithBlueprint;
  bhdField: (fieldName: string) => BhdContentBlockComponentFieldProps;
  bhdRoot: () => BhdContentBlockComponentRootProps;
  loadingComponent: ElementType;
  ref: Ref<HTMLElement>;
};

export type BhdBlueprintLut = Record<
  string,
  ElementType<BhdContentBlockComponentProps>
>;
