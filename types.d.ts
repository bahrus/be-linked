import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE, Declarations} from 'be-enhanced/types';
import {QueryInfo, Scope, camelQry, JSONObject} from 'trans-render/lib/types';

export interface EndUserProps extends IBE {
    camelConfig?: CamelConfig | CamelConfig[],
}

export interface AllProps extends EndUserProps{
    canonicalConfig?: CanonicalConfig;
    propertyBag?: EventTarget;
}

export type propName = string;
export type UpstreamPropPath = string;
export type DownstreamPropPath = string;
export type UpstreamCamelQry = camelQry;
export type DownstreamCamelQry = camelQry;
export type EventName = string;

export type SuperShortLinkStatement = `${propName}Props`;

export type TargetOptions = '$0' | 'Decorator'

export type ShortDownLinkStatement = `${UpstreamPropPath}Of${UpstreamCamelQry}To${DownstreamPropPath}Of${TargetOptions}`;

export type ParseLinkStatement = `As${ParseOptions}${ShortDownLinkStatement}`

export type LinkStatement = SuperShortLinkStatement | ShortDownLinkStatement;

export type InvokeStatement = string;

export type ExportSymbol = string;

export type DownstreamAssignStatement = `ResultOf${ExportSymbol}To$0When${UpstreamPropPath}PropertyOf${UpstreamCamelQry}Changes`;

export type ConditionValue = string | number | boolean;
export type NewValue = string;

export type IfStatement = `${UpstreamPropPath}PropertyOf${UpstreamCamelQry}Is${ConditionValue}ThenSet${DownstreamPropPath}PropertyOf${TargetOptions}To${NewValue}`;
export type OnPassStatement = `${EventName}EventOf${UpstreamCamelQry}Pass${UpstreamPropPath}PropertyTo${DownstreamPropPath}PropertyOf${TargetOptions}`;
export type ObserveStatement = string;
export type ShareStatement = string;
export type ToggleStatement = string;
export type OnIncrementStatement = `${EventName}EventOf${UpstreamCamelQry}DoIncrement${DownstreamPropPath}Of${TargetOptions}`;
export type ParseOptions = 'string' | 'number' | 'date' | 'regExp' | 'object' | 'url';
export type MathOp = '+' | '-' | '*' | '/' | '%';
export type WhenStatement = `${UpstreamPropPath}PropertyOf${UpstreamCamelQry}ChangesIncrement${DownstreamPropPath}PropertyOf${TargetOptions}`;
export type NumericString = string;

export type FireStatement = string;
export type DebugStatement = string;
//export type TranslateStatement = `By${NumericString}`;

export type PassDirection = 'away' | 'towards' | 'sync';

export type LocalInstance = 'local' | 'proxy';

export interface HandlerArg {
    remoteInstance: EventTarget,
    $0: Element,
    event?: Event,
}

export interface IObserve {
    names: string[],
    scope: Scope,
    attr: string,
    isFormElement: boolean,
    on?: string,
}

export interface Share{
    names?: string[],
    allNames?: boolean,
    scope: Scope,
    attr: string,
    source: Source,
    //source: ScopedSource | ElementPropsSource,
}

export interface Invoke{

}

export interface Toggle{

}


export interface ShareLink<TSrc = any, TDest = any>{

}

export interface Link<TSrc = any, TDest = any>{
    scrutinize?: string,
    enhancement?: string,
    localInstance: LocalInstance,
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
    passDirection?: PassDirection, //default to down
    handler?: (arg: HandlerArg) => any,
    inferInvokeTarget?: boolean,
    inferInvokeTriggerEvent?: boolean,
    invoke?: string,
    exportSymbol?: string,
    increment?: boolean,
    observe?: IObserve,
    share?: Share,
    beSyndicating?: boolean,
    upstreamPropPath: UpstreamPropPath, 
    upstreamPropName?: string & keyof TSrc,
    upstreamCamelQry: Scope,
    downstreamPropPath?: DownstreamPropPath,
    downstreamPropName?: string & keyof TDest,
    fire?: string[],
    memKey?: string,
    //catchAll?: string,
}

export interface SharingCamelConfig<TSrc=any, TDest = any>{
    Share?: ShareStatement[];
    shareOverrides?: Share;
}

export interface InvokeCamelConfig<TSrc=any, TDest = any>{
    Invoke?: InvokeStatement[];
    invokeOverrides?: Invoke;
}

export interface ToggleCamelConfig<TSrc = any, TDest = any>{
    Toggle?: ToggleStatement[];
    toggleOverrides
}

export interface CamelConfig<TSrc=any, TDest=any> extends SharingCamelConfig<TSrc, TDest>{
    Link?: LinkStatement[];
    negate?: boolean;
    Negate?: LinkStatement[];
    Debug?: [DebugStatement];
    debug?: boolean;
    Clone?: LinkStatement[];
    Refer?: LinkStatement[];
    Assign?: DownstreamAssignStatement[];
    Invoke?: InvokeStatement[];
    On?: OnPassStatement[];
    Nudge?: [''];
    nudge?: boolean;
    Skip?: [''];
    skip?: boolean;
    links?: Link<TSrc, TDest>[];
    When?: WhenStatement[];
    Toggle?: ToggleStatement[];
    Fire?: FireStatement[];
    fire?: string[];
    declare: Declarations,
    //enh: {[key: string] : any},
    settings?:  Settings;
    Observe?: ObserveStatement[];
    observeOverrides?: IObserve;

}

export interface Settings{
    enh?: {[key: string]: IBE}
}

export interface CanonicalConfig{
    links: Link[];
    settings?:  Settings;
}

export interface AllProps extends EndUserProps {}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export type Source = 'scope' | '$0' | 'host' | 'props' | '$1'; //$1 means parent or host


export interface Actions{
    camelToCanonical(self: this): ProPAP;
    onCanonical(self: this): ProPAP;
}

export interface IP {
    el: Element,
    names: string[]
}