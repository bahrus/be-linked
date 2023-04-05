import {
    downstream, toDownstream, parseOption, mathOpArg, assResOf
} from './reCommon.js';

export const upstreamEvent = String.raw `^(?<on>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)`;
export const downstreamEvent = String.raw `^(?<on>\w+)(?<!\\)EventOfAdornedElement`;
export const passUpstreamProp = String.raw `(?<!\\)Pass(?<upstreamPropPath>[\w\:]+)(?<!\\)Property`;
export const passDownstreamProp = String.raw `Pass(?<downstreamPropPath>[\w\\\:]+)Property`;
export const toUpstreamProp = String.raw `(?<!\\)To(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)`;
export const toUpstreamCQ = String.raw `(?<!\\)To(?<upstreamCamelQry>\w+)`
export const upstreamInvoke = String.raw `(?<!\\)InvokeMethod(?<invoke>\w+)(?<!\\)Of(?<upstreamCamelQry>\w+)`