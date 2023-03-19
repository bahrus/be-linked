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


export type LinkStatement = SuperShortLinkStatement | ShortDownLinkStatement;

export type ParseOptions = 'String' | 'Number' | 'Date' | 'RegExp' | 'Object' | 'Url';
export type ParseStatement = `As${ParseOptions}`;
export type NumericString = string;

export type TranslateStatement = `By${NumericString}`;

export interface Link<TSrc = any, TDest = any>{
    scrutinize?: string,
    target: 'local' | 'proxy',
    negate?: boolean,
    nudge?: boolean,
    translate?: number,
    on?: string,
    of?: camelQry,
    clone?: boolean,
    skipInit?: boolean,
    passDirection?: 'up' | 'down' | 'sync', //default to down
}

export interface DownLink<TSrc, TDest> extends Link<TSrc, TDest>{
    upstreamPropPath?: string, 
    upstreamPropName?: string & keyof TSrc,
    downstreamPropPath?: string,
    downstreamPropName?: string & keyof TDest,
}

export interface CamelConfig<TSrc=any, TDest=any>{
    Link?: LinkStatement[];
    link?: DownLink<TSrc, TDest>[];
    Negate?: LinkStatement[];
    Clone?: LinkStatement[];
    Stringify?: LinkStatement[];
    Numberfy?: LinkStatement[];
    Parse?: [ParseStatement];
    Nudge?: [''];
    nudge?: boolean;
    Skip?: [''];
    skip?: boolean;
    Minus?: [TranslateStatement];
    Plus?: [TranslateStatement];
}

export interface CanonicalConfig{

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