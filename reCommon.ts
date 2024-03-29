export const upstreamProperty = String.raw `^(?<upstreamPropPath>[\w\:]+)(?<!\\)Property`;
export const upstream = String.raw `${upstreamProperty}Of(?<upstreamCamelQry>\w+)`;
export const parseOption = String.raw `(?<!\\)As(?<parseOption>Number|Date|String|Object|Url|RegExp)`;
export const downstreamGateway = String.raw `\$0\+(?<enhancement>[\w\-\:]+)`;
export const downstreamPropPath = String.raw `(?<downstreamPropPath>[\w\:\$\+]+)`;
export const downstream = String.raw `${downstreamPropPath}(?<!\\)PropertyOf\$0`;
export const PropertyTo= String.raw `(?<!\\)PropertyTo`;
export const to = String.raw `(?<!\\)To`;
export const toDownstream = String.raw `${to}${downstream}`;
export const toDownstreamGateway = String.raw `${to}${downstreamGateway}`;
export const toCatchAll = String.raw `${to}(?<catchAll>[\w\:]+)`
export const mathOpArg = String.raw `(?<mathOp>[-+\%\*\/])(?<mathArg>[0-9][0-9,\.]+)`;
export const toAdorned = String.raw `${to}\$0`;
export const assResOf = String.raw `AssignResultOf(?<exportSymbol>\w+)`;