import { ComponentProps, ElementType, HTMLProps, Ref } from "react";
import { BhdContentBlockWithBlueprint } from "./models";

export type BhdContentBlockComponentFieldProps = {
  "data-bhd-field-name": string;
} & Pick<HTMLProps<HTMLElement>, "contentEditable" | "onInput">;

export type BhdContentBlockComponentRootProps = {
  "data-bhd-block-id": string;
  "data-bhd-block-parent-field-name"?: string;
};

export type BhdContentBlockComponentProps = {
  contentBlock: BhdContentBlockWithBlueprint;
  bhdField: <T extends ElementType, P = ComponentProps<T>>(
    fieldName: string,
    props: P,
  ) => BhdContentBlockComponentFieldProps & P;
  bhdRoot: <T extends ElementType, P = ComponentProps<T>>(
    props: P,
  ) => BhdContentBlockComponentRootProps & P;
  loadingComponent: ElementType;
  ref: Ref<HTMLElement>;
};

export type BhdBlueprintLut = Record<
  string,
  ElementType<BhdContentBlockComponentProps>
>;
