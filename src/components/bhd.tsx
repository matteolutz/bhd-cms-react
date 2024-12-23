import { FC, forwardRef, HTMLProps, useEffect, useState } from "react";
import { useBhdInternalContext } from "../utils/context";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { BhdContentBlockComponent } from "./contentBlock";

export type BhdComponentProps = {
  contentBlockId: string;
};

export const BhdComponent: FC<BhdComponentProps> = forwardRef<
  HTMLElement,
  BhdComponentProps & HTMLProps<HTMLElement>
>(({ contentBlockId, ...rest }, ref) => {
  const context = useBhdInternalContext();

  const [contentBlock, setContentBlock] = useState<
    | {
        state: "loading";
      }
    | { state: "loaded"; data: BhdContentBlockWithBlueprint }
    | { state: "failed"; reason: string }
  >({ state: "loading" });

  useEffect(() => {
    context
      .getContentBlock(contentBlockId)
      .then((contentBlock) =>
        setContentBlock({ state: "loaded", data: contentBlock }),
      )
      .catch((error) =>
        setContentBlock({ state: "failed", reason: "" + error }),
      );
  }, [contentBlockId, context]);

  if (contentBlock.state === "loading") {
    return <context.loadingComponent {...rest} />;
  }

  if (contentBlock.state === "failed") {
    // TODO: custom error component
    return <div {...rest}>Error: {contentBlock.reason}</div>;
  }

  return (
    <BhdContentBlockComponent
      ref={ref}
      contentBlock={contentBlock.data}
      {...rest}
    />
  );
});
