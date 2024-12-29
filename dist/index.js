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
var BhdContentBlockComponent = forwardRef(({ contentBlock, inlineComponent, options, ...rest }, ref) => {
  const context = useBhdInternalContext();
  const Component = inlineComponent ?? context.getBlueprintComponent(contentBlock.contentBlockBlueprintId);
  const bhdField = (fieldName, props) => ({
    ...props,
    "data-bhd-field-name": fieldName,
    ...context.liveEditEnabled ? {
      onClick: (e) => {
        console.log(
          "field click",
          contentBlock.id,
          fieldName,
          "on element",
          e.target
        );
        context.onFieldClick(contentBlock.id, fieldName);
        if (props && typeof props === "object" && "onClick" in props && typeof props.onClick === "function")
          props.onClick(e);
      }
    } : {}
  });
  const bhdRoot = (props) => ({
    ...props,
    "data-bhd-block-id": contentBlock.id,
    ..."data-bhd-field-name" in rest ? {
      "data-bhd-block-parent-field-name": rest["data-bhd-field-name"]
    } : {}
  });
  if (Component) {
    return /* @__PURE__ */ jsx(
      Component,
      {
        ref,
        loadingComponent: context.loadingComponent,
        contentBlock,
        bhdField,
        bhdRoot,
        options,
        ...rest
      }
    );
  }
  return /* @__PURE__ */ jsxs("p", { ...bhdRoot({}), children: [
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
var BhdComponent = forwardRef2(({ contentBlockId, options, ...rest }, ref) => {
  const context = useBhdInternalContext();
  const [contentBlock, setContentBlock] = useState({ state: "loading" });
  useEffect(() => {
    setContentBlock({ state: "loading" });
    context.getContentBlock(contentBlockId).then(
      (contentBlock2) => setContentBlock({ state: "loaded", data: contentBlock2 })
    ).catch(
      (error) => setContentBlock({ state: "failed", reason: "" + error })
    );
  }, [contentBlockId, context]);
  if (contentBlock.state === "loading") {
    return /* @__PURE__ */ jsx2(context.loadingComponent, { ...rest });
  }
  if (contentBlock.state === "failed") {
    return /* @__PURE__ */ jsxs2("div", { ...rest, children: [
      "Error: ",
      contentBlock.reason
    ] });
  }
  return /* @__PURE__ */ jsx2(
    BhdContentBlockComponent,
    {
      ref,
      contentBlock: contentBlock.data,
      options,
      ...rest
    }
  );
});

// src/components/inline.tsx
import { forwardRef as forwardRef3, useEffect as useEffect2, useState as useState2 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var BhdInlineComponent = forwardRef3(({ contentBlockId, children, options, ...rest }, ref) => {
  const context = useBhdInternalContext();
  const [contentBlock, setContentBlock] = useState2({ state: "loading" });
  useEffect2(() => {
    setContentBlock({ state: "loading" });
    context.getContentBlock(contentBlockId).then(
      (contentBlock2) => setContentBlock({ state: "loaded", data: contentBlock2 })
    ).catch(
      (error) => setContentBlock({ state: "failed", reason: "" + error })
    );
  }, [contentBlockId, context]);
  if (contentBlock.state === "loading") {
    return /* @__PURE__ */ jsx3(context.loadingComponent, { ...rest });
  }
  if (contentBlock.state === "failed") {
    return /* @__PURE__ */ jsxs3("div", { ...rest, children: [
      "Error: ",
      contentBlock.reason
    ] });
  }
  return /* @__PURE__ */ jsx3(
    BhdContentBlockComponent,
    {
      inlineComponent: children,
      ref,
      contentBlock: contentBlock.data,
      options,
      ...rest
    }
  );
});

// src/components/context.tsx
import { useEffect as useEffect3, useState as useState3 } from "react";
import axios from "axios";

// src/utils/url.ts
var DEFAULT_BASE_URL = "https://bhd.matteolutz.de";

// src/components/context.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
var BhdContext = ({ children, options }) => {
  const [context, setContext] = useState3(() => {
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
      loadingComponent: options.loadingComponent ?? (() => /* @__PURE__ */ jsx4("p", { children: "Loading..." })),
      liveEditEnabled: false,
      onFieldClick: (blockId, fieldName) => {
        window.top?.postMessage(
          {
            bhd: true,
            type: "bhd-live-edit-field-click",
            field: { blockId, fieldName }
          },
          "*"
        );
      },
      ...options
    };
  });
  useEffect3(() => {
    if (context.liveEditEnabled) document.body.dataset.bhdLiveEdit = "enabled";
    else document.body.dataset.bhdLiveEdit = "disabled";
  }, [context.liveEditEnabled]);
  useEffect3(() => {
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
  return /* @__PURE__ */ jsx4(BhdInternalContext.Provider, { value: context, children });
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
  BhdInlineComponent,
  useBhdContext
};
//# sourceMappingURL=index.js.map