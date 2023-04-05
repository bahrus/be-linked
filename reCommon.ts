export const upstream = String.raw `^(?<upstreamPropPath>[\w\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)`;
export const parseOption = String.raw `(?<!\\)As(?<parseOption>Number|Date|String|Object|Url|RegExp)`;
export const downstream = String.raw `(?<downstreamPropPath>[\w\:]+)(?<!\\)PropertyOfAdornedElement`;
export const toDownstream = String.raw `To${downstream}`;
export const mathOpArg = String.raw `(?<mathOp>[-+\%\*\/])(?<mathArg>[0-9][0-9,\.]+)`;
export const toAdorned = String.raw `(?<!\\)ToAdornedElement`;
export const assResOf = String.raw `AssignResultOf(?<exportSymbol>\w+)`;