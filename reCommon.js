export const upstreamProperty = String.raw `^(?<upstreamPropPath>[\w\:]+)(?<!\\)Property`;
export const upstream = String.raw `${upstreamProperty}Of(?<upstreamCamelQry>\w+)`;
export const parseOption = String.raw `(?<!\\)As(?<parseOption>Number|Date|String|Object|Url|RegExp)`;
export const downstreamGateway = String.raw `\$0-enh-by-(?<enhancement>[\w\-]+)(?<!\\)\=\>(?<downstreamPropPath>[\w\:]+)`;
export const downstream = String.raw `(?<downstreamPropPath>[\w\:]+)(?<!\\)PropertyOf\$0`;
export const toDownstream = String.raw `To${downstream}`;
export const toDownstreamGateway = String.raw `To${downstreamGateway}`;
export const toCatchAll = String.raw `To(?<catchAll>[\w\:]+)`;
export const mathOpArg = String.raw `(?<mathOp>[-+\%\*\/])(?<mathArg>[0-9][0-9,\.]+)`;
export const toAdorned = String.raw `(?<!\\)To\$0`;
export const assResOf = String.raw `AssignResultOf(?<exportSymbol>\w+)`;
