import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';
import {QueryInfo, Scope, camelQry, JSONObject} from 'trans-render/lib/types';

export interface EndUserProps {
    camelConfig?: CamelConfig | CamelConfig[],
}

export type propName = string;
export type upstreamPropName = string;
export type downstreamPropName = string;
export type upstreamCamelQry = camelQry;
export type downstreamCamelQry = camelQry;

export type SuperShortLinkStatement = `${propName}Props`;

export type ShortLinkStatement = `${upstreamPropName}Of${upstreamCamelQry}To${downstreamPropName}Of${downstreamCamelQry}`;

export type LinkStatement = SuperShortLinkStatement | ShortLinkStatement;

export interface CamelConfig{
    Link?: [LinkStatement];
    link?: LinkStatement;
    Negate?: [LinkStatement];
    negate?: LinkStatement;
    Nudge?: [''];
    nudge?: boolean;
    Skip?: [''];
    skip?: boolean;
}