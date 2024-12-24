import { ElementType, FC, PropsWithChildren, useEffect, useState } from "react";
import { BhdInternalContext, BhdInternalContextType } from "../utils/context";
import axios from "axios";
import { DEFAULT_BASE_URL } from "../utils/url";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { BhdBlueprintLut } from "../types";

export type BhdContextOptions = {
  accessToken: string;
  baseUrl?: string;
  blueprintLut: BhdBlueprintLut;
  loadingComponent?: ElementType;
};

export const BhdContext: FC<
  PropsWithChildren<{ options: BhdContextOptions }>
> = ({ children, options }) => {
  const [context] = useState<BhdInternalContextType>(() => {
    const axiosInstance = axios.create({
      baseURL: new URL("api", options.baseUrl ?? DEFAULT_BASE_URL).href,
      headers: {
        "Content-Type": "application/json",
      },
    });

    axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${context.accessToken}`;
      return config;
    });

    return {
      axiosInstance,
      getAssetUrl: (assetId: string): string =>
        new URL(
          `api/asset/${assetId}?accessToken=${context.accessToken}`,
          options.baseUrl ?? DEFAULT_BASE_URL,
        ).href,
      getContentBlock: (id: string): Promise<BhdContentBlockWithBlueprint> =>
        context.axiosInstance
          .get<{ block: BhdContentBlockWithBlueprint }>(`/block/${id}`)
          .then((res) => res.data.block),
      getBlueprintComponent: (
        id: string,
      ): BhdBlueprintLut[keyof BhdBlueprintLut] => context.blueprintLut[id],
      loadingComponent: options.loadingComponent ?? (() => <p>Loading...</p>),
      ...options,
    };
  });

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (e.data === "bhd-live-edit") {
        window.top?.postMessage("bhd-live-edit-ack", "*");
      }
    });
  }, []);

  return (
    <BhdInternalContext.Provider value={context}>
      {children}
    </BhdInternalContext.Provider>
  );
};
