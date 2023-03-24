import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {QueryInfo, Scope, camelQry, JSONObject} from 'trans-render/lib/types';

export interface EndUserProps {
    camelConfig?: CamelConfig | CamelConfig[],
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    canonicalConfig?: CanonicalConfig;
}

export type propName = string;
export type upstreamPropPath = string;
export type downstreamPropPath = string;
export type upstreamCamelQry = camelQry;
export type downstreamCamelQry = camelQry;

export type SuperShortLinkStatement = `${propName}Props`;

export type TargetStatement = 'AdornedElement' | 'Decorator'

export type ShortDownLinkStatement = `${upstreamPropPath}Of${upstreamCamelQry}To${downstreamPropPath}Of${TargetStatement}`;

export type ParseLinkStatement = `As${ParseOptions}${ShortDownLinkStatement}`

export type LinkStatement = SuperShortLinkStatement | ShortDownLinkStatement;

export type ExportSymbol = string;

export type UseStatement = `${ExportSymbol}ImportToManage${upstreamPropPath}PropertyChangesTo${upstreamCamelQry}`;

export type ParseOptions = 'string' | 'number' | 'date' | 'regExp' | 'object' | 'url';
//export type ParseStatement = `As${ParseOptions}`;
export type NumericString = string;



export type TranslateStatement = `By${NumericString}`;

export interface Link<TSrc = any, TDest = any>{
    scrutinize?: string,
    target: 'local' | 'proxy',
    negate?: boolean,
    nudge?: boolean,
    translate?: number,
    parseOption?: ParseOptions,
    on?: string,
    of?: camelQry,
    clone?: boolean,
    refer?: boolean,
    skipInit?: boolean,
    passDirection?: 'up' | 'down' | 'sync', //default to down
    handler?: (arg: HandlerArg) => any,

}

export interface HandlerArg {
    remoteInstance: EventTarget,
}

export interface DownLink<TSrc = any, TDest = any> extends Link<TSrc, TDest>{
    upstreamPropPath: string, 
    upstreamPropName?: string & keyof TSrc,
    upstreamCamelQry: Scope,
    downstreamPropPath?: string,
    downstreamPropName?: string & keyof TDest,
}

export interface CamelConfig<TSrc=any, TDest=any>{
    Link?: LinkStatement[];
    //link?: DownLink<TSrc, TDest>[];
    negate?: boolean;
    Negate?: LinkStatement[];
    Clone?: LinkStatement[];
    Refer?: LinkStatement[];
    Use?: UseStatement[];

    Nudge?: [''];
    nudge?: boolean;
    Skip?: [''];
    skip?: boolean;
    downlinks?: DownLink<TSrc, TDest>[]
}

export interface CanonicalConfig{
    downlinks: DownLink[];
}

export type Proxy = (HTMLScriptElement | HTMLTemplateElement) & VirtualProps;

export interface PP extends VirtualProps{
    proxy: Proxy
}

export type PPP = Partial<PP>;

export type PPPP = Promise<PPP>;

export interface Actions{
    camelToCanonical(pp: PP): PPPP;
    onCanonical(pp: PP, mold: PPP): PPPP;
}