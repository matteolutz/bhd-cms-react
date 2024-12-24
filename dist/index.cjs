"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  BhdComponent: () => BhdComponent,
  BhdContext: () => BhdContext,
  useBhdContext: () => useBhdContext
});
module.exports = __toCommonJS(src_exports);

// src/components/bhd.tsx
var import_react3 = require("react");

// src/utils/context.ts
var import_react = require("react");
var BhdInternalContext = (0, import_react.createContext)(
  {}
);
var useBhdInternalContext = () => (0, import_react.useContext)(BhdInternalContext);

// src/components/contentBlock.tsx
var import_react2 = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var BhdContentBlockComponent = (0, import_react2.forwardRef)(({ contentBlock, ...rest }, ref) => {
  const context = useBhdInternalContext();
  const Component = context.getBlueprintComponent(
    contentBlock.contentBlockBlueprintId
  );
  const bhdField = (fieldName) => ({
    "data-bhd-field-name": fieldName
  });
  const bhdRoot = () => ({
    "data-bhd-block-id": contentBlock.id,
    ..."data-bhd-field-name" in rest ? {
      "data-bhd-block-parent-field-name": rest["data-bhd-field-name"]
    } : {}
  });
  if (Component) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Component,
      {
        ref,
        loadingComponent: context.loadingComponent,
        contentBlock,
        bhdField,
        bhdRoot,
        ...rest
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { ...bhdRoot(), children: [
    "No component was registered for the blueprint",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: contentBlock.contentBlockBlueprint.name }),
    " (ID:",
    " ",
    contentBlock.contentBlockBlueprintId,
    ")."
  ] });
});

// src/components/bhd.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var BhdComponent = (0, import_react3.forwardRef)(({ contentBlockId, ...rest }, ref) => {
  const context = useBhdInternalContext();
  const [contentBlock, setContentBlock] = (0, import_react3.useState)({ state: "loading" });
  (0, import_react3.useEffect)(() => {
    context.getContentBlock(contentBlockId).then(
      (contentBlock2) => setContentBlock({ state: "loaded", data: contentBlock2 })
    ).catch(
      (error) => setContentBlock({ state: "failed", reason: "" + error })
    );
  }, [contentBlockId, context]);
  if (contentBlock.state === "loading") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(context.loadingComponent, { ...rest });
  }
  if (contentBlock.state === "failed") {
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { ...rest, children: [
      "Error: ",
      contentBlock.reason
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    BhdContentBlockComponent,
    {
      ref,
      contentBlock: contentBlock.data,
      ...rest
    }
  );
});

// src/components/context.tsx
var import_react4 = require("react");
var import_axios = __toESM(require("axios"), 1);

// src/utils/url.ts
var DEFAULT_BASE_URL = "https://bhd.matteolutz.de";

// src/components/context.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var BhdContext = ({ children, options }) => {
  const [context] = (0, import_react4.useState)(() => {
    const axiosInstance = import_axios.default.create({
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
      loadingComponent: options.loadingComponent ?? (() => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { children: "Loading..." })),
      ...options
    };
  });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(BhdInternalContext.Provider, { value: context, children });
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BhdComponent,
  BhdContext,
  useBhdContext
});
//# sourceMappingURL=index.cjs.map