import { forwardRef } from "react";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { useBhdInternalContext } from "../utils/context";

export type BhdContentBlockInternalComponentProps = {
  contentBlock: BhdContentBlockWithBlueprint;
};

export const BhdContentBlockComponent = forwardRef<
  HTMLElement,
  BhdContentBlockInternalComponentProps
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
        bhdProps={(fieldName: string) => ({
          "data-bhd-block-id": contentBlock.id,
          "data-bhd-field-name": fieldName,
        })}
        {...rest}
      />
    );
  }

  return (
    <p>
      No component was registered for the blueprint{" "}
      <strong>{contentBlock.contentBlockBlueprint.name}</strong> (ID:{" "}
      {contentBlock.contentBlockBlueprintId}).
    </p>
  );
});
