import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {QueryInfo, Scope, camelQry, JSONObject} from 'trans-render/lib/types';

export interface EndUserProps {
    camelConfig?: CamelConfig | CamelConfig[],
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
    canonicalConfig?: CanonicalConfig;
}

export type propName = string;
export type UpstreamPropPath = string;
export type DownstreamPropPath = string;
export type UpstreamCamelQry = camelQry;
export type DownstreamCamelQry = camelQry;
export type EventName = string;

export type SuperShortLinkStatement = `${propName}Props`;

export type TargetOptions = 'AdornedElement' | 'Decorator'

export type ShortDownLinkStatement = `${UpstreamPropPath}Of${UpstreamCamelQry}To${DownstreamPropPath}Of${TargetOptions}`;

export type ParseLinkStatement = `As${ParseOptions}${ShortDownLinkStatement}`

export type LinkStatement = SuperShortLinkStatement | ShortDownLinkStatement;

export type ExportSymbol = string;

export type DownstreamAssignStatement = `ResultOf${ExportSymbol}ToAdornedElementWhen${UpstreamPropPath}PropertyOf${UpstreamCamelQry}Changes`;

export type ConditionValue = string | number | boolean;
export type NewValue = string;

export type IfStatement = `${UpstreamPropPath}Of${UpstreamCamelQry}Is${ConditionValue}ThenSet${DownstreamPropPath}Of${TargetOptions}To${NewValue}`;
export type OnPassStatement = `${EventName}EventOf${UpstreamCamelQry}Pass${UpstreamPropPath}To${DownstreamPropPath}Of${TargetOptions}`;
export type OnIncrementStatement = `${EventName}EventOf${UpstreamCamelQry}DoIncrement${DownstreamPropPath}Of${TargetOptions}`;
export type ParseOptions = 'string' | 'number' | 'date' | 'regExp' | 'object' | 'url';
//export type ParseStatement = `As${ParseOptions}`;
export type NumericString = string;

export type DebugStatement = string;

export type TranslateStatement = `By${NumericString}`;

export interface Link<TSrc = any, TDest = any>{
    scrutinize?: string,
    localInstance: 'local' | 'proxy',
    negate?: boolean,
    nudge?: boolean,
    translate?: number,
    parseOption?: ParseOptions,
    conditionValue?: ConditionValue,
    newValue?: NewValue,
    on?: string,
    of?: camelQry,
    clone?: boolean,
    refer?: boolean,
    skipInit?: boolean,
    debug?: boolean,
    passDirection?: 'away' | 'towards' | 'sync', //default to down
    handler?: (arg: HandlerArg) => any,
    increment?: boolean,
}

export interface HandlerArg {
    remoteInstance: EventTarget,
    adornedElement: Element,
}

export interface DownLink<TSrc = any, TDest = any> extends Link<TSrc, TDest>{
    upstreamPropPath: UpstreamPropPath, 
    upstreamPropName?: string & keyof TSrc,
    upstreamCamelQry: Scope,
    downstreamPropPath?: DownstreamPropPath,
    downstreamPropName?: string & keyof TDest,
}

export interface CamelConfig<TSrc=any, TDest=any>{
    Link?: LinkStatement[];
    negate?: boolean;
    Negate?: LinkStatement[];
    Debug?: [DebugStatement];
    debug?: boolean;
    Clone?: LinkStatement[];
    Refer?: LinkStatement[];
    
    Assign?: DownstreamAssignStatement[];
    If?: IfStatement[];
    On?: OnPassStatement[];
    Nudge?: [''];
    nudge?: boolean;
    Skip?: [''];
    skip?: boolean;
    links?: DownLink<TSrc, TDest>[],
    
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