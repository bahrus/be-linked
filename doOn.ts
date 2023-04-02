import {
    CamelConfig, Link, UpstreamPropPath, UpstreamCamelQry, DownstreamPropPath, 
    ConditionValue, NewValue, EventName, ParseOptions, MathOp, PassDirection,
    LocalInstance,
    PP,
} from './types';
import {Scope} from 'trans-render/lib/types';
import {RegExpOrRegExpExt} from 'be-decorated/types';
import {
    downstream, toDownstream, parseOption, mathOpArg, adjustLink,
    assResOf
} from './be-linked.js';


export async function doOn(cc: CamelConfig, links: Link[], pp: PP){
    const {On, debug, nudge, skip, fire, declare} = cc;
    const defaultLink = {
        debug,
        nudge,
        skipInit: skip,
        fire,
    } as Link;
    const {tryParse} = await import('be-decorated/cpu.js');
    for(const onString of On!){
        const test = tryParse(onString, reOnPassStatements, declare) as OnPassStatement | null;
        if(test !== null){
            await adjustLink(test as Link, pp);
            links.push({
                ...defaultLink,
                ...test,
            })
        }
    }
}

interface OnPassStatement {
    on: EventName,
    upstreamCamelQry: Scope & string,
    upstreamPropPath: UpstreamPropPath,
    downstreamPropPath: DownstreamPropPath,
    parseOption?: ParseOptions,
    mathOp?: MathOp,
    increment?: boolean,
    passDirection: PassDirection,
    localInstance: LocalInstance,
}

type POPS = Partial<OnPassStatement>


const defaultTowards: POPS = {
    passDirection: 'towards',
    localInstance: 'local',
}

const defaultAway: POPS = {
    passDirection: 'away',
    localInstance: 'local'
}

const upstreamEvent = String.raw `^(?<on>\w+)(?<!\\)EventOf(?<upstreamCamelQry>\w+)`;
const downstreamEvent = String.raw `^(?<on>\w+)(?<!\\)EventOfAdornedElement`;
const passUpstreamProp = String.raw `(?<!\\)Pass(?<upstreamPropPath>[\w\:]+)(?<!\\)Property`;
const passDownstreamProp = String.raw `Pass(?<downstreamPropPath>[\w\\\:]+)Property`;
const toUpstreamProp = String.raw `(?<!\\)To(?<upstreamPropPath>[\w\\\:]+)(?<!\\)PropertyOf(?<upstreamCamelQry>\w+)`;
const toUpstreamCQ = String.raw `(?<!\\)To(?<upstreamCamelQry>\w+)`
const upstreamInvoke = String.raw `(?<!\\)InvokeMethod(?<invoke>\w+)(?<!\\)Of(?<upstreamCamelQry>\w+)`

const reOnPassStatements : RegExpOrRegExpExt<POPS>[] = [
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${parseOption}${mathOpArg}${toDownstream}`),
        defaultVals: {...defaultTowards}
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${parseOption}${toDownstream}`),
        defaultVals: {...defaultTowards}
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${mathOpArg}${toDownstream}`),
        defaultVals: {...defaultTowards}
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}${passUpstreamProp}${toDownstream}`),
        defaultVals: {...defaultTowards}
    },
    {
        regExp: new RegExp(String.raw `${upstreamEvent}(?<!\\)Increment${downstream}`),
        defaultVals: {
            ...defaultTowards,
            increment: true,
        }
    },
    {
        regExp: new RegExp(String.raw `${downstreamEvent}${passDownstreamProp}${parseOption}${toUpstreamProp}`),
        defaultVals: {
            ...defaultTowards,
            passDirection: 'away'
        }
    },
    {
        regExp: new RegExp(String.raw `${downstreamEvent}${passDownstreamProp}${toUpstreamProp}`),
        defaultVals: {
            ...defaultTowards,
            passDirection: 'away'
        }
    },
    {
        regExp: new RegExp(String.raw `${downstreamEvent}${assResOf}${toUpstreamCQ}`),
        defaultVals: {
            ...defaultAway,
            
        }
    },
    {
        regExp: new RegExp(String.raw `${downstream}${upstreamInvoke}`),
        defaultVals: {
            ...defaultAway
        }
    }
    
]





