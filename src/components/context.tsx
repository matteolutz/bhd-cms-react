import { ElementType, FC, PropsWithChildren, useEffect, useState } from "react";
import { BhdInternalContext, BhdInternalContextType } from "../utils/context";
import axios from "axios";
import { DEFAULT_BASE_URL } from "../utils/url";
import { BhdContentBlockWithBlueprint } from "../models/contentBlock";
import { BhdBlueprintLut, BhdError } from "../types";

export type BhdContextOptions = {
  accessToken: string;
  baseUrl?: string;
  blueprintLut: BhdBlueprintLut;
  loadingComponent?: ElementType;
  errorComponent?: ElementType<{ error: BhdError }>;
};

export const BhdContext: FC<
  PropsWithChildren<{ options: BhdContextOptions }>
> = ({ children, options }) => {
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
      errorComnponent:
        options.errorComponent ??
        (({ error }) => (
          <div>
            Error ({error.type}): {"" + error.reason}
          </div>
        )),
      liveEditEnabled: false,
      onFieldClick: (blockId: string, fieldName: string) => {
        window.top?.postMessage(
          {
            bhd: true,
            type: "bhd-live-edit-field-click",
            field: { blockId, fieldName },
          },
          "*",
        );
      },
      ...options,
    };
  });

  useEffect(() => {
    if (context.liveEditEnabled) document.body.dataset.bhdLiveEdit = "enabled";
    else document.body.dataset.bhdLiveEdit = "disabled";
  }, [context.liveEditEnabled]);

  useEffect(() => {
    window.top?.postMessage({ bhd: true, type: "bhd-ready" }, "*");

    window.addEventListener("message", (e) => {
      if (!("bhd" in e.data)) return;

      switch (e.data.type) {
        case "bhd-live-edit":
          setContext((prev) => ({ ...prev, liveEditEnabled: true }));
          break;
        case "bhd-live-edit-reload": {
          setContext((prev) => ({ ...prev }));
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
