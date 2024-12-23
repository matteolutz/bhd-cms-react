import { ElementType } from "react";
import { BhdContentBlockWithBlueprint } from "./models";

export type BhdContentBlockComponentProps = {
  contentBlock: BhdContentBlockWithBlueprint;
  loadingComponent: ElementType;
};

export type BhdBlueprintLut = Record<
  string,
  ElementType<BhdContentBlockComponentProps>
>;
