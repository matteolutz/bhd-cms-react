// src/components/bhd.tsx
import { forwardRef as forwardRef2, useEffect, useState } from "react";

// src/utils/context.ts
import { createContext, useContext } from "react";
var BhdInternalContext = createContext(
  {}
);
var useBhdInternalContext = () => useContext(BhdInternalContext);

// src/components/contentBlock.tsx
import { forwardRef } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var BhdContentBlockComponent = forwardRef(({ contentBlock, ...rest }, ref) => {
  const context = useBhdInternalContext();
  const Component = context.getBlueprintComponent(
    contentBlock.contentBlockBlueprintId
  );
  if (Component) {
    return /* @__PURE__ */ jsx(
      Component,
      {
        ref,
        loadingComponent: context.loadingComponent,
        contentBlock,
        ...rest
      }
    );
  }
  return /* @__PURE__ */ jsxs("p", { children: [
    "No component was registered for the blueprint",
    " ",
    /* @__PURE__ */ jsx("strong", { children: contentBlock.contentBlockBlueprint.name }),
    " (ID:",
    " ",
    contentBlock.contentBlockBlueprintId,
    ")."
  ] });
});

// src/components/bhd.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var BhdComponent = forwardRef2(({ contentBlockId, ...rest }, ref) => {
  const context = useBhdInternalContext();
  const [contentBlock, setContentBlock] = useState({ state: "loading" });
  useEffect(() => {
    context.getContentBlock(contentBlockId).then(
      (contentBlock2) => setContentBlock({ state: "loaded", data: contentBlock2 })
    ).catch(
      (error) => setContentBlock({ state: "failed", reason: "" + error })
    );
  }, [contentBlockId, context]);
  if (contentBlock.state === "loading") {
    return /* @__PURE__ */ jsx2(context.loadingComponent, {});
  }
  if (contentBlock.state === "failed") {
    return /* @__PURE__ */ jsxs2("div", { children: [
      "Error: ",
      contentBlock.reason
    ] });
  }
  return /* @__PURE__ */ jsx2(
    BhdContentBlockComponent,
    {
      ref,
      contentBlock: contentBlock.data,
      ...rest
    }
  );
});

// src/components/context.tsx
import { useState as useState2 } from "react";
import axios from "axios";

// src/utils/url.ts
var DEFAULT_BASE_URL = "https://bhd.matteolutz.de";

// src/components/context.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var BhdContext = ({ children, options }) => {
  const [context] = useState2(() => {
    const axiosInstance = axios.create({
      baseURL: new URL("api", options.baseUrl ?? DEFAULT_BASE_URL).href,
      headers: {
        "Content-Type": "application/json"
      }
    });
    axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${context.accessToken}`;
      return config;
    });
    return {
      axiosInstance,
      getAssetUrl: (assetId) => new URL(
        `api/asset/${assetId}?accessToken=${context.accessToken}`,
        options.baseUrl ?? DEFAULT_BASE_URL
      ).href,
      getContentBlock: (id) => context.axiosInstance.get(`/block/${id}`).then((res) => res.data.block),
      getBlueprintComponent: (id) => context.blueprintLut[id],
      loadingComponent: options.loadingComponent ?? (() => /* @__PURE__ */ jsx3("p", { children: "Loading..." })),
      ...options
    };
  });
  return /* @__PURE__ */ jsx3(BhdInternalContext.Provider, { value: context, children });
};

// src/utils/index.ts
var useBhdContext = () => {
  const internalContext = useBhdInternalContext();
  return {
    accessToken: internalContext.accessToken,
    blueprintLut: internalContext.blueprintLut,
    getContentBlock: internalContext.getContentBlock,
    getAssetUrl: internalContext.getAssetUrl
  };
};
export {
  BhdComponent,
  BhdContext,
  useBhdContext
};
//# sourceMappingURL=index.js.map