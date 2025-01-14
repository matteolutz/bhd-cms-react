import { FC, forwardRef, HTMLProps, useEffect, useState } from "react";
import { BhdContentBlockComponentProps } from "../types";
import { BhdComponentProps } from "./bhd";
import { useBhdInternalContext } from "../utils/context";
import { BhdContentBlockWithBlueprint } from "../models";
import { BhdContentBlockComponent } from "./contentBlock";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BhdInlineComponentProps<T extends object = any> =
  BhdComponentProps<T> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: FC<BhdContentBlockComponentProps<any>>;
  };

export const BhdInlineComponent = forwardRef<
  HTMLElement,
  BhdInlineComponentProps & Omit<HTMLProps<HTMLElement>, "children">
>(({ contentBlockId, children, options, ...rest }, ref) => {
  const context = useBhdInternalContext();

  const [contentBlock, setContentBlock] = useState<
    | {
        state: "loading";
      }
    | { state: "loaded"; data: BhdContentBlockWithBlueprint }
    | { state: "failed"; reason: string }
  >({ state: "loading" });

  useEffect(() => {
    setContentBlock({ state: "loading" });

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
      inlineComponent={children}
      ref={ref}
      contentBlock={contentBlock.data}
      options={options}
      {...rest}
    />
  );
});
