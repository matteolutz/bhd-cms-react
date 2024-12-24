import { AxiosInstance } from "axios";
import { createContext, ElementType, useContext } from "react";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { BhdBlueprintLut } from "../types";

export type BhdContextType = {
  accessToken: string;
  blueprintLut: BhdBlueprintLut;
  getContentBlock: (id: string) => Promise<BhdContentBlockWithBlueprint>;
  getAssetUrl: (assetId: string) => string;
};

export type BhdInternalContextType = BhdContextType & {
  axiosInstance: AxiosInstance;

  getBlueprintComponent: (id: string) => BhdBlueprintLut[keyof BhdBlueprintLut];

  onFieldChange: (blockId: string, fieldName: string, value: unknown) => void;

  loadingComponent: ElementType;

  liveEditEnabled: boolean;
};

export const BhdInternalContext = createContext<BhdInternalContextType>(
  {} as BhdInternalContextType,
);

export const useBhdInternalContext = () => useContext(BhdInternalContext);
