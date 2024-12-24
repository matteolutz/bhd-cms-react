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
  const [dirtyLiveFields, setDirtyLiveFields] = useState<
    Record<string, Record<string, unknown>>
  >({});

  const [context, setContext] = useState<BhdInternalContextType>(() => {
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
      liveEditEnabled: false,
      onFieldChange: (blockId: string, fieldName: string, value: unknown) =>
        setDirtyLiveFields({
          ...dirtyLiveFields,
          [blockId]: {
            ...(dirtyLiveFields[blockId] ?? {}),
            [fieldName]: value,
          },
        }),
      ...options,
    };
  });

  useEffect(() => {
    if (context.liveEditEnabled) document.body.dataset.bhdLiveEdit = "enabled";
    else document.body.dataset.bhdLiveEdit = "disabled";
  }, [context.liveEditEnabled]);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      if (!("bhd" in e.data)) return;

      console.log(e.data);

      switch (e.data.type) {
        case "bhd-live-edit":
          setContext((prev) => ({ ...prev, liveEditEnabled: true }));
          break;
        case "bhd-live-edit-save": {
          window.top?.postMessage(
            {
              bhd: true,
              type: "bhd-live-edit-save-result",
              dirtyFields: dirtyLiveFields,
            },
            "*",
          );
          setDirtyLiveFields({});
          break;
        }
      }
    });
  }, []);

  return (
    <BhdInternalContext.Provider value={context}>
      {children}
    </BhdInternalContext.Provider>
  );
};
