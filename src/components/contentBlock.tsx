import { forwardRef, HTMLProps } from "react";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { useBhdInternalContext } from "../utils/context";

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

  if (Component) {
    return (
      <Component
        ref={ref}
        loadingComponent={context.loadingComponent}
        contentBlock={contentBlock}
        bhdField={(fieldName: string) => ({
          "data-bhd-field-name": fieldName,
        })}
        bhdRoot={() => ({
          "data-bhd-block-id": contentBlock.id,
          ...("data-bhd-field-name" in rest
            ? {
                "data-bhd-block-parent-field-name": rest[
                  "data-bhd-field-name"
                ] as string,
              }
            : {}),
        })}
        {...rest}
      />
    );
  }

  return (
    <p {...rest} data-bhd-block-id={contentBlock.id}>
      No component was registered for the blueprint{" "}
      <strong>{contentBlock.contentBlockBlueprint.name}</strong> (ID:{" "}
      {contentBlock.contentBlockBlueprintId}).
    </p>
  );
});
