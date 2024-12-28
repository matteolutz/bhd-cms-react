import { ComponentProps, ElementType, FC, forwardRef, HTMLProps } from "react";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { useBhdInternalContext } from "../utils/context";
import {
  BhdContentBlockComponentFieldProps,
  BhdContentBlockComponentProps,
  BhdContentBlockComponentRootProps,
} from "../types";

export type BhdContentBlockInternalComponentProps = {
  contentBlock: BhdContentBlockWithBlueprint;
  inlineComponent?: FC<BhdContentBlockComponentProps>;
};

export const BhdContentBlockComponent = forwardRef<
  HTMLElement,
  BhdContentBlockInternalComponentProps & HTMLProps<HTMLElement>
>(({ contentBlock, inlineComponent, ...rest }, ref) => {
  const context = useBhdInternalContext();

  const Component =
    inlineComponent ??
    context.getBlueprintComponent(contentBlock.contentBlockBlueprintId);

  const bhdField = <T extends ElementType, P = ComponentProps<T>>(
    fieldName: string,
    props: P,
  ): BhdContentBlockComponentFieldProps & P => ({
    ...props,
    "data-bhd-field-name": fieldName,
    contentEditable: context.liveEditEnabled ? "plaintext-only" : "false",
    suppressContentEditableWarning: true,
    ...(context.liveEditEnabled
      ? {
          onInput: (e) => {
            // TODO: check for live
            context.onFieldChange(
              contentBlock.id,
              fieldName,
              (e.target as HTMLElement).innerText,
            );
            if (
              props &&
              typeof props === "object" &&
              "onInput" in props &&
              typeof props.onInput === "function"
            )
              props.onInput(e);
          },
        }
      : {}),
  });

  const bhdRoot = <T extends ElementType, P = ComponentProps<T>>(
    props: P,
  ): BhdContentBlockComponentRootProps & P => ({
    ...props,
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
    <p {...bhdRoot<"p">({})}>
      No component was registered for the blueprint{" "}
      <strong>{contentBlock.contentBlockBlueprint.name}</strong> (ID:{" "}
      {contentBlock.contentBlockBlueprintId}).
    </p>
  );
});
