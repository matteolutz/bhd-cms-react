import { forwardRef, HTMLProps } from "react";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { useBhdInternalContext } from "../utils/context";
import {
  BhdContentBlockComponentFieldProps,
  BhdContentBlockComponentRootProps,
} from "../types";

export type BhdContentBlockInternalComponentProps = {
  contentBlock: BhdContentBlockWithBlueprint;
};

export const BhdContentBlockComponent = forwardRef<
  HTMLElement,
  BhdContentBlockInternalComponentProps & HTMLProps<HTMLElement>
>(({ contentBlock, ...rest }, ref) => {
  const context = useBhdInternalContext();

  const Component = context.getBlueprintComponent(
    contentBlock.contentBlockBlueprintId,
  );

  const bhdField = (fieldName: string): BhdContentBlockComponentFieldProps => ({
    "data-bhd-field-name": fieldName,
    contentEditable: context.liveEditEnabled ? "plaintext-only" : "false",
    onInput: context.liveEditEnabled
      ? (e) =>
          context.onFieldChange(
            contentBlock.id,
            fieldName,
            (e.target as HTMLElement).innerText,
          )
      : undefined,
  });

  const bhdRoot = (): BhdContentBlockComponentRootProps => ({
    "data-bhd-block-id": contentBlock.id,
    ...("data-bhd-field-name" in rest
      ? {
          "data-bhd-block-parent-field-name": rest[
            "data-bhd-field-name"
          ] as string,
        }
      : {}),
  });

  if (Component) {
    return (
      <Component
        ref={ref}
        loadingComponent={context.loadingComponent}
        contentBlock={contentBlock}
        bhdField={bhdField}
        bhdRoot={bhdRoot}
        {...rest}
      />
    );
  }

  return (
    <p {...bhdRoot()}>
      No component was registered for the blueprint{" "}
      <strong>{contentBlock.contentBlockBlueprint.name}</strong> (ID:{" "}
      {contentBlock.contentBlockBlueprintId}).
    </p>
  );
});
