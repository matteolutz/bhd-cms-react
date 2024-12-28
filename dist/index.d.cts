import * as react from 'react';
import { FC, HTMLProps, ElementType, ComponentProps, Ref, PropsWithChildren } from 'react';

type BhdComponentProps<T extends object = any> = {
    contentBlockId: string;
    options?: T;
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
    "data-bhd-field-name": string;
} & Pick<HTMLProps<HTMLElement>, "contentEditable" | "onInput">;
type BhdContentBlockComponentRootProps = {
    "data-bhd-block-id": string;
    "data-bhd-block-parent-field-name"?: string;
};
type BhdContentBlockComponentProps<T extends object = object> = {
    contentBlock: BhdContentBlockWithBlueprint;
    bhdField: <T extends ElementType, P = ComponentProps<T>>(fieldName: string, props: P) => BhdContentBlockComponentFieldProps & P;
    bhdRoot: <T extends ElementType, P = ComponentProps<T>>(props: P) => BhdContentBlockComponentRootProps & P;
    loadingComponent: ElementType;
    ref: Ref<HTMLElement>;
    options?: T;
};
type BhdBlueprintLut = Record<string, ElementType<BhdContentBlockComponentProps<any>>>;

type BhdInlineComponentProps<T extends object = any> = BhdComponentProps<T> & {
    children: FC<BhdContentBlockComponentProps<any>>;
};
declare const BhdInlineComponent: react.ForwardRefExoticComponent<Omit<BhdComponentProps<any> & {
    children: FC<BhdContentBlockComponentProps<any>>;
} & Omit<HTMLProps<HTMLElement>, "children">, "ref"> & react.RefAttributes<HTMLElement>>;

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

export { type BhdBlueprintLut, BhdComponent, type BhdComponentProps, type BhdContentBlock, type BhdContentBlockBlueprint, type BhdContentBlockComponentFieldProps, type BhdContentBlockComponentProps, type BhdContentBlockComponentRootProps, type BhdContentBlockWithBlueprint, BhdContext, type BhdContextOptions, type BhdContextType, BhdInlineComponent, type BhdInlineComponentProps, useBhdContext };
