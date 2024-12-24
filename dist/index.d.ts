import { FC, ElementType, Ref, PropsWithChildren } from 'react';

type BhdComponentProps = {
    contentBlockId: string;
};
declare const BhdComponent: FC<BhdComponentProps>;

type BhdContentBlockBlueprint = {
    id: string;
    name: string;
    type: "PAGE" | "UI_COMPONENT" | "CONFIG";
    tag?: string;
    schema: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    projectId: string;
};

type BhdContentBlock = {
    id: string;
    name: string;
    content: any;
    createdAt: string;
    updatedAt: string;
    contentBlockBlueprintId: string;
};
type BhdContentBlockWithBlueprint = BhdContentBlock & {
    contentBlockBlueprint: Pick<BhdContentBlockBlueprint, "projectId" | "tag" | "name">;
};

type BhdContentBlockComponentFieldProps = {
    "data-bhdBlockId": string;
    "data-bhdFieldName": string;
};
type BhdContentBlockComponentProps = {
    contentBlock: BhdContentBlockWithBlueprint;
    bhdProps: (fieldName: string) => BhdContentBlockComponentFieldProps;
    loadingComponent: ElementType;
    ref: Ref<HTMLElement>;
};
type BhdBlueprintLut = Record<string, ElementType<BhdContentBlockComponentProps>>;

type BhdContextOptions = {
    accessToken: string;
    baseUrl?: string;
    blueprintLut: BhdBlueprintLut;
    loadingComponent?: ElementType;
};
declare const BhdContext: FC<PropsWithChildren<{
    options: BhdContextOptions;
}>>;

type BhdContextType = {
    accessToken: string;
    blueprintLut: BhdBlueprintLut;
    getContentBlock: (id: string) => Promise<BhdContentBlockWithBlueprint>;
    getAssetUrl: (assetId: string) => string;
};

declare const useBhdContext: () => BhdContextType;

export { type BhdBlueprintLut, BhdComponent, type BhdComponentProps, type BhdContentBlock, type BhdContentBlockBlueprint, type BhdContentBlockComponentFieldProps, type BhdContentBlockComponentProps, type BhdContentBlockWithBlueprint, BhdContext, type BhdContextOptions, type BhdContextType, useBhdContext };
