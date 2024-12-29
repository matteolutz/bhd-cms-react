import { ComponentProps, ElementType, FC, forwardRef, HTMLProps } from "react";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { useBhdInternalContext } from "../utils/context";
import {
  BhdContentBlockComponentFieldProps,
  BhdContentBlockComponentProps,
  BhdContentBlockComponentRootProps,
} from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BhdContentBlockInternalComponentProps<T extends object = any> = {
  contentBlock: BhdContentBlockWithBlueprint;
  options: T;
  inlineComponent?: FC<BhdContentBlockComponentProps<T>>;
};

export const BhdContentBlockComponent = forwardRef<
  HTMLElement,
  BhdContentBlockInternalComponentProps & HTMLProps<HTMLElement>
>(({ contentBlock, inlineComponent, options, ...rest }, ref) => {
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
    ...(context.liveEditEnabled
      ? {
          onClick: (e) => {
            e.stopPropagation();
            console.log(
              "field click",
              contentBlock.id,
              fieldName,
              "on element",
              e.target,
            );
            context.onFieldClick(contentBlock.id, fieldName);

            if (
              props &&
              typeof props === "object" &&
              "onClick" in props &&
              typeof props.onClick === "function"
            )
              props.onClick(e);
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
        options={options}
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
