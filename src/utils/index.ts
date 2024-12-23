import { BhdContextType, useBhdInternalContext } from "./context";

export { type BhdContextType } from "./context";

export const useBhdContext = (): BhdContextType => {
  const internalContext = useBhdInternalContext();

  return {
    accessToken: internalContext.accessToken,
    blueprintLut: internalContext.blueprintLut,
    getContentBlock: internalContext.getContentBlock,
    getAssetUrl: internalContext.getAssetUrl,
  };
};
